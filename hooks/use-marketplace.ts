"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { type PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { useCallback, useMemo } from "react";
import {
  getConfigPDA,
  getItemPDA,
  getListingPDA,
  getReceiptPDA,
  solToLamports,
  type ItemData,
  type ListingData,
} from "@/lib/solana/program";
import { IDL, type Kaiwu } from "@/lib/idl/kaiwu";
import crypto from "crypto";

export function useMarketplace() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey) return null;
    return new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    );
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program<Kaiwu>(IDL, provider);
  }, [provider]);

  const createHash = (input: string): number[] => {
    const hash = crypto.createHash("sha256").update(input).digest();
    return Array.from(hash);
  };

  const intakeItem = useCallback(
    async (
      itemId: number,
      sku: string,
      vaultLocation: string,
      initialOwner: PublicKey
    ) => {
      if (!program || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);
      const [receiptPDA] = getReceiptPDA(itemPDA);
      const [configPDA] = getConfigPDA();

      const skuHash = createHash(sku);
      const vaultHash = createHash(vaultLocation);

      console.log("[v0] Intaking item:", {
        itemId,
        sku,
        vaultLocation,
        initialOwner: initialOwner.toBase58(),
      });

      const tx = await program.methods
        .intakeItem(itemIdBN, skuHash as any, vaultHash as any)
        .accounts({
          config: configPDA,
          item: itemPDA,
          receipt: receiptPDA,
          initialOwner: initialOwner,
          operator: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("[v0] Item intaked successfully:", signature);
      return signature;
    },
    [program, wallet, connection]
  );

  const listItem = useCallback(
    async (itemId: number, priceSOL: number, expiresInDays: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);
      const [listingPDA] = getListingPDA(itemPDA);
      const [receiptPDA] = getReceiptPDA(itemPDA);

      const priceLamports = solToLamports(priceSOL);
      const expiresAt = new BN(
        Math.floor(Date.now() / 1000) + expiresInDays * 86400
      );

      console.log("[v0] Listing item:", { itemId, priceSOL, expiresInDays });

      const tx = await program.methods
        .listItem(priceLamports, expiresAt)
        .accounts({
          item: itemPDA,
          receipt: receiptPDA,
          listing: listingPDA,
          currentOwner: wallet.publicKey,
          owner: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("[v0] Item listed successfully:", signature);
      return signature;
    },
    [program, wallet, connection]
  );

  const delistItem = useCallback(
    async (itemId: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);
      const [listingPDA] = getListingPDA(itemPDA);
      const [receiptPDA] = getReceiptPDA(itemPDA);

      console.log("[v0] Delisting item:", itemId);

      const tx = await program.methods
        .delistItem()
        .accounts({
          item: itemPDA,
          receipt: receiptPDA,
          listing: listingPDA,
          currentOwner: wallet.publicKey,
          owner: wallet.publicKey,
          seller: wallet.publicKey,
        } as any)
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("[v0] Item delisted successfully:", signature);
      return signature;
    },
    [program, wallet, connection]
  );

  const buyItem = useCallback(
    async (itemId: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);
      const [listingPDA] = getListingPDA(itemPDA);
      const [receiptPDA] = getReceiptPDA(itemPDA);
      const [configPDA] = getConfigPDA();

      // Fetch listing to get seller
      const listingAccount = await program.account.listing.fetch(listingPDA);
      const seller = listingAccount.seller;

      // Fetch config to get treasury
      const configAccount = await program.account.config.fetch(configPDA);
      const treasury = configAccount.treasury;

      console.log("[v0] Buying item:", {
        itemId,
        seller: seller.toBase58(),
        treasury: treasury.toBase58(),
      });

      const tx = await program.methods
        .buyItem()
        .accounts({
          config: configPDA,
          item: itemPDA,
          receipt: receiptPDA,
          listing: listingPDA,
          buyer: wallet.publicKey,
          seller: seller,
          treasury: treasury,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("[v0] Item purchased successfully:", signature);
      return signature;
    },
    [program, wallet, connection]
  );

  const redeemRequest = useCallback(
    async (itemId: number) => {
      if (!program || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);
      const [receiptPDA] = getReceiptPDA(itemPDA);

      console.log("[v0] Requesting redemption for item:", itemId);

      const tx = await program.methods
        .redeemRequest()
        .accounts({
          item: itemPDA,
          receipt: receiptPDA,
          currentOwner: wallet.publicKey,
          owner: wallet.publicKey,
        } as any)
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("[v0] Redemption requested successfully:", signature);
      return signature;
    },
    [program, wallet, connection]
  );

  const redeemConfirm = useCallback(
    async (itemId: number, warehouseRef: string) => {
      if (!program || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);
      const [receiptPDA] = getReceiptPDA(itemPDA);
      const [configPDA] = getConfigPDA();

      console.log("[v0] Confirming redemption for item:", {
        itemId,
        warehouseRef,
      });

      const tx = await program.methods
        .redeemConfirm(warehouseRef)
        .accounts({
          config: configPDA,
          item: itemPDA,
          receipt: receiptPDA,
          operator: wallet.publicKey,
        } as any)
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("[v0] Redemption confirmed successfully:", signature);
      return signature;
    },
    [program, wallet, connection]
  );

  const initConfig = useCallback(
    async (feeBps: number, treasury: PublicKey, governance: PublicKey) => {
      if (!program || !wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      const [configPDA] = getConfigPDA();

      console.log("[v0] Initializing config:", {
        feeBps,
        treasury: treasury.toBase58(),
        governance: governance.toBase58(),
      });

      const tx = await program.methods
        .initConfig(feeBps, treasury, governance)
        .accounts({
          config: configPDA,
          governance: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("[v0] Config initialized successfully:", signature);
      return signature;
    },
    [program, wallet, connection]
  );

  const fetchItem = useCallback(
    async (itemId: number): Promise<ItemData | null> => {
      if (!program) return null;

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);

      try {
        const itemAccount = await program.account.item.fetch(itemPDA);
        console.log("[v0] Fetched item:", itemAccount);
        return itemAccount as any;
      } catch (error) {
        console.error("[v0] Error fetching item:", error);
        return null;
      }
    },
    [program]
  );

  const fetchListing = useCallback(
    async (itemId: number): Promise<ListingData | null> => {
      if (!program) return null;

      const itemIdBN = new BN(itemId);
      const [itemPDA] = getItemPDA(itemIdBN);
      const [listingPDA] = getListingPDA(itemPDA);

      try {
        const listingAccount = await program.account.listing.fetch(listingPDA);
        console.log("[v0] Fetched listing:", listingAccount);
        return listingAccount as any;
      } catch (error) {
        console.error("[v0] Error fetching listing:", error);
        return null;
      }
    },
    [program]
  );

  return {
    buyItem,
    listItem,
    delistItem,
    redeemRequest,
    intakeItem,
    redeemConfirm,
    initConfig,
    fetchItem,
    fetchListing,
    connected: !!wallet.publicKey,
  };
}
