"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useCallback, useEffect, useState, useMemo } from "react";
import type { Transaction } from "@solana/web3.js";
import {
  PROGRAM_ID,
  getItemPDA,
  getListingPDA,
  getReceiptPDA,
} from "@/lib/solana/program";
import { IDL, type Kaiwu } from "@/lib/idl/kaiwu";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

export interface ListedItem {
  itemId: number;
  itemPubkey: PublicKey;
  seller: PublicKey;
  priceLamports: BN;
  priceSOL: number;
  expiresAt: BN;
  active: boolean;
  skuHash: number[];
  vaultHash: number[];
  status: any;
  createdAt: BN;
}

export interface ItemDetails {
  itemId: number;
  itemPubkey: PublicKey;
  skuHash: number[];
  vaultHash: number[];
  status: any;
  currentOwner: PublicKey;
  createdAt: BN;
  listing?: {
    seller: PublicKey;
    priceLamports: BN;
    priceSOL: number;
    expiresAt: BN;
    active: boolean;
  };
  receipt?: {
    owner: PublicKey;
    state: any;
  };
}

export interface UserItem extends ItemDetails {
  isOwner: boolean;
  canList: boolean;
  canRedeem: boolean;
}

export function useSolanaEvents() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const readOnlyWallet = useMemo(
    () => ({
      publicKey: new PublicKey("11111111111111111111111111111111"),
      // No-op signers keep Anchor happy for read-only usage
      async signTransaction<T extends Transaction>(tx: T): Promise<T> {
        return tx;
      },
      async signAllTransactions<T extends Transaction>(txs: T[]): Promise<T[]> {
        return txs;
      },
    }),
    []
  );

  const provider = useMemo(() => {
    const hasWalletSigner =
      wallet.publicKey && wallet.signTransaction && wallet.signAllTransactions;

    return new AnchorProvider(
      connection,
      (hasWalletSigner ? wallet : readOnlyWallet) as any,
      AnchorProvider.defaultOptions()
    );
  }, [connection, wallet, readOnlyWallet]);

  const program = useMemo(() => {
    return new Program<Kaiwu>(IDL, provider);
  }, [provider]);

  // 获取所有上架的商品
  const useListedItems = () => {
    const [items, setItems] = useState<ListedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchListedItems = useCallback(async () => {
      if (!program) return;

      try {
        setLoading(true);
        setError(null);

        // 获取程序的最近交易签名
        const signatures = await connection.getSignaturesForAddress(
          PROGRAM_ID,
          {
            limit: 1000, // 最近1000个交易
          }
        );

        const listedItems: ListedItem[] = [];
        const processedItems = new Set<string>();

        // 解析交易获取事件
        for (const sig of signatures) {
          try {
            const tx = await connection.getParsedTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0,
            });

            if (!tx?.meta?.logMessages) continue;

            // 查找 listed 事件
            const listedLogIndex = tx.meta.logMessages.findIndex(
              (log) =>
                log.includes("Program log: AnchorError") &&
                log.includes("listed")
            );

            if (listedLogIndex === -1) continue;

            // 从交易中提取账户信息
            const accounts = tx.transaction.message.accountKeys;
            const programIndex = accounts.findIndex((key) =>
              key.pubkey.equals(PROGRAM_ID)
            );

            if (programIndex === -1) continue;

            // 查找 listing 账户
            const listingAccount = accounts.find((acc) => {
              try {
                const [pda] = PublicKey.findProgramAddressSync(
                  [Buffer.from("listing"), acc.pubkey.toBuffer()],
                  PROGRAM_ID
                );
                return pda.equals(acc.pubkey);
              } catch {
                return false;
              }
            });

            if (!listingAccount) continue;

            // 获取 listing 数据
            try {
              const listingData = await program.account.listing.fetch(
                listingAccount.pubkey
              );

              if (!listingData.active) continue;

              // 获取 item 数据
              const itemData = await program.account.item.fetch(
                listingData.item
              );

              const itemId = itemData.itemId.toNumber();
              const itemKey = `${itemId}`;

              if (processedItems.has(itemKey)) continue;
              processedItems.add(itemKey);

              listedItems.push({
                itemId,
                itemPubkey: listingData.item,
                seller: listingData.seller,
                priceLamports: listingData.priceLamports,
                priceSOL: listingData.priceLamports.toNumber() / 1_000_000_000,
                expiresAt: listingData.expiresAt,
                active: listingData.active,
                skuHash: itemData.skuHash,
                vaultHash: itemData.vaultHash,
                status: itemData.status,
                createdAt: itemData.createdAt,
              });
            } catch (err) {
              console.warn("Error fetching listing data:", err);
            }
          } catch (err) {
            console.warn("Error parsing transaction:", err);
          }
        }

        setItems(listedItems);
      } catch (err) {
        console.error("Error fetching listed items:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    }, [program, connection]);

    useEffect(() => {
      fetchListedItems();
    }, [fetchListedItems]);

    return { items, loading, error, refetch: fetchListedItems };
  };

  // 获取单个商品详情
  const useItemDetails = (itemId: number) => {
    const [item, setItem] = useState<ItemDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItemDetails = useCallback(async () => {
      if (!program || !itemId) return;

      try {
        setLoading(true);
        setError(null);

        const itemIdBN = new BN(itemId);
        const [itemPDA] = getItemPDA(itemIdBN);
        const [listingPDA] = getListingPDA(itemPDA);
        const [receiptPDA] = getReceiptPDA(itemPDA);

        // 获取 item 数据
        const itemData = await program.account.item.fetch(itemPDA);

        const itemDetails: ItemDetails = {
          itemId,
          itemPubkey: itemPDA,
          skuHash: itemData.skuHash,
          vaultHash: itemData.vaultHash,
          status: itemData.status,
          currentOwner: itemData.currentOwner,
          createdAt: itemData.createdAt,
        };

        // 尝试获取 listing 数据
        try {
          const listingData = await program.account.listing.fetch(listingPDA);
          itemDetails.listing = {
            seller: listingData.seller,
            priceLamports: listingData.priceLamports,
            priceSOL: listingData.priceLamports.toNumber() / 1_000_000_000,
            expiresAt: listingData.expiresAt,
            active: listingData.active,
          };
        } catch {
          // Listing 不存在，商品未上架
        }

        // 尝试获取 receipt 数据
        try {
          const receiptData = await program.account.receipt.fetch(receiptPDA);
          itemDetails.receipt = {
            owner: receiptData.owner,
            state: receiptData.state,
          };
        } catch {
          // Receipt 不存在
        }

        setItem(itemDetails);
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch item details"
        );
      } finally {
        setLoading(false);
      }
    }, [program, itemId]);

    useEffect(() => {
      fetchItemDetails();
    }, [fetchItemDetails]);

    return { item, loading, error, refetch: fetchItemDetails };
  };

  // 获取用户拥有的商品
  const useUserItems = (userWallet?: PublicKey) => {
    const [items, setItems] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const walletToUse = userWallet || wallet.publicKey;

    const fetchUserItems = useCallback(async () => {
      if (!program || !walletToUse) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("开始获取用户商品...");

        const userItems: UserItem[] = [];

        // 简化方法: 尝试获取所有item账户，如果失败就返回空数组
        try {
          // 使用 anchor 的 methods 来获取所有item
          // 设置5秒超时
          const allItems = await Promise.race([
            program.account.item.all(),
            new Promise<any[]>((resolve) =>
              setTimeout(() => {
                console.warn("获取商品超时，返回空数组");
                resolve([]);
              }, 5000)
            ),
          ]);

          console.log(`找到 ${allItems.length} 个item账户`);

          // 遍历所有item账户，找到用户拥有的
          for (const itemRecord of allItems) {
            try {
              const itemData = itemRecord.account;

              // 检查用户是否拥有此商品
              const isOwner = itemData.currentOwner.equals(walletToUse);
              if (!isOwner) continue;

              const itemId = itemData.itemId.toNumber();
              const [listingPDA] = getListingPDA(itemRecord.publicKey);
              const [receiptPDA] = getReceiptPDA(itemRecord.publicKey);

              const userItem: UserItem = {
                itemId,
                itemPubkey: itemRecord.publicKey,
                skuHash: itemData.skuHash,
                vaultHash: itemData.vaultHash,
                status: itemData.status,
                currentOwner: itemData.currentOwner,
                createdAt: itemData.createdAt,
                isOwner: true,
                canList: itemData.status.inVault !== undefined,
                canRedeem:
                  itemData.status.inVault !== undefined ||
                  itemData.status.sold !== undefined,
              };

              // 尝试获取 listing 数据
              try {
                const listingData = await program.account.listing.fetch(
                  listingPDA
                );
                userItem.listing = {
                  seller: listingData.seller,
                  priceLamports: listingData.priceLamports,
                  priceSOL:
                    listingData.priceLamports.toNumber() / 1_000_000_000,
                  expiresAt: listingData.expiresAt,
                  active: listingData.active,
                };
              } catch {
                // Listing 不存在
              }

              // 尝试获取 receipt 数据
              try {
                const receiptData = await program.account.receipt.fetch(
                  receiptPDA
                );
                userItem.receipt = {
                  owner: receiptData.owner,
                  state: receiptData.state,
                };
              } catch {
                // Receipt 不存在
              }

              userItems.push(userItem);
            } catch (err) {
              console.warn("Error fetching item:", err);
            }
          }
        } catch (err) {
          console.error("Failed to fetch items:", err);
          // 如果失败，返回空数组，不阻塞用户操作
        }

        console.log(`用户拥有 ${userItems.length} 个商品`);
        setItems(userItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user items:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch user items"
        );
        setItems([]); // 设置空数组，不阻塞用户操作
        setLoading(false);
      }
    }, [program, connection, walletToUse]);

    useEffect(() => {
      fetchUserItems();
    }, [fetchUserItems]);

    return { items, loading, error, refetch: fetchUserItems };
  };

  // 监听新事件
  const useEventSubscription = (onNewEvent?: (event: any) => void) => {
    useEffect(() => {
      if (!program || !onNewEvent) return;

      // 订阅程序日志
      const subscriptionId = connection.onLogs(
        PROGRAM_ID,
        (logs, context) => {
          // 解析日志中的事件
          logs.logs.forEach((log) => {
            if (log.includes("Program log: AnchorError")) {
              // 这里可以解析具体的事件类型
              onNewEvent({ type: "program_log", data: log });
            }
          });
        },
        "confirmed"
      );

      return () => {
        connection.removeOnLogsListener(subscriptionId);
      };
    }, [connection, program, onNewEvent]);
  };

  return {
    useListedItems,
    useItemDetails,
    useUserItems,
    useEventSubscription,
  };
}
