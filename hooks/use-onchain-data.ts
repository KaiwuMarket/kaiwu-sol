"use client"

import { useEffect, useState, useCallback } from "react"
import bs58 from 'bs58';
import { useConnection } from "@solana/wallet-adapter-react"
import { Program } from "@coral-xyz/anchor"
import { Kaiwu, IDL } from "@/lib/idl/kaiwu"
import { PublicKey } from "@solana/web3.js"
import * as anchor from "@coral-xyz/anchor"

// 从 CLAUDE.md 中获取程序 ID
const KAIWU_PROGRAM_ID = new PublicKey(
  "GRvRew38U4sWvpuMnDRVLXkdgz9E3QCXVbBhcywCS39m"
)

// ----------------------------------------------------------------------------
// --- Type Definitions ---
// ----------------------------------------------------------------------------

// Structure for the metadata JSON fetched from the vault URL
export interface Metadata {
  name: string;
  description: string;
  image: string;
}

// The final, combined structure for an item, including on-chain and metadata
export interface OnchainItem {
  // On-chain data
  pda: string;
  itemId: string;
  status: string;
  currentOwner: string;
  vault: string; // This is the metadata URI
  createdAt: string;

  // Off-chain metadata
  name: string;
  description: string;
  image: string;

  // Listing details (if applicable)
  listing?: {
    pda: string;
    priceSol: number;
  };
}

// ----------------------------------------------------------------------------
// --- The React Hook ---
// ----------------------------------------------------------------------------

export function useOnchainData() {
  const { connection } = useConnection();
  const [program, setProgram] = useState<Program<Kaiwu> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the program instance
  useEffect(() => {
    const provider = new anchor.AnchorProvider(connection, {} as any, {
      preflightCommitment: "processed",
    });
    const programInstance = new Program<Kaiwu>(IDL, provider);
    setProgram(programInstance);
  }, [connection]);


  // --- Helper function to fetch and process a batch of items ---
  const processItems = useCallback(async (
    itemPdas: PublicKey[],
    listingMap?: Map<string, any>
  ): Promise<OnchainItem[]> => {

    if (itemPdas.length === 0) return [];

    // 1. Fetch all on-chain account data in parallel
    const accountsInfo = await connection.getMultipleAccountsInfo(itemPdas);

    const decodedChainData = accountsInfo.map((info, i) => {
      if (!info) return null;
      try {
        return program!.coder.accounts.decode("item", info.data);
      } catch (e) {
        console.error(`Failed to decode item at PDA ${itemPdas[i].toBase58()}`, e);
        return null;
      }
    }).filter(item => item !== null);


    // 2. Fetch all metadata from URIs in parallel
    const metadataPromises = decodedChainData.map(item =>
        fetch(item.vault).then(res => res.json()).catch(err => ({ error: `Failed to fetch metadata: ${err.message}` }))
    );
    const metadatas = await Promise.all(metadataPromises);


    // 3. Combine on-chain data with off-chain metadata
    const combinedItems: OnchainItem[] = [];
    for (let i = 0; i < decodedChainData.length; i++) {
        const item = decodedChainData[i];
        const metadata = metadatas[i] as Metadata;
        const pda = itemPdas.find(p => p.toBase58() === itemPdas[i].toBase58())!.toBase58(); // Find corresponding PDA
        const listing = listingMap?.get(pda);

        if (metadata.error) {
            console.warn(`Skipping item ${item.itemId.toString()} due to metadata error:`, metadata.error);
            continue;
        }

        combinedItems.push({
            pda: pda,
            itemId: item.itemId.toString(),
            status: Object.keys(item.status)[0],
            currentOwner: item.currentOwner.toBase58(),
            vault: item.vault,
            createdAt: new Date(item.createdAt.toNumber() * 1000).toLocaleString(),
            name: metadata.name || `Item #${item.itemId.toString()}`,
            description: metadata.description || "No description available.",
            image: metadata.image || "/placeholder.svg",
            listing: listing ? {
                pda: listing.publicKey.toBase58(),
                priceSol: listing.account.priceLamports.toNumber() / anchor.web3.LAMPORTS_PER_SOL
            } : undefined
        });
    }

    return combinedItems;

  }, [program, connection]);


  // --- Main Query Functions ---

  const fetchAllListedItems = useCallback(async (): Promise<OnchainItem[]> => {
    if (!program) return [];

    setLoading(true);
    setError(null);

    try {
      const listings = await program.account.listing.all();
      if (listings.length === 0) return [];

      const itemPdas = listings.map(l => l.account.item);
      const listingMap = new Map(listings.map(l => [l.account.item.toBase58(), l]));

      return await processItems(itemPdas, listingMap);

    } catch (err) {
      console.error("Failed to fetch listed items:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [program, processItems]);


  const fetchItemDetails = useCallback(
    async (itemId: string): Promise<OnchainItem | null> => {
      if (!program) return null;

      setLoading(true);
      setError(null);

      try {
        // 1. Derive Item PDA
        const itemIdBN = new anchor.BN(itemId);
        const [itemPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("item"), itemIdBN.toArrayLike(Buffer, "le", 8)],
            program.programId
        );

        // 2. Derive Listing PDA and try to fetch it
        const [listingPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("listing"), itemPda.toBuffer()],
            program.programId
        );

        const listingMap = new Map();
        try {
            const listingAccount = await program.account.listing.fetch(listingPda);
            // We need to create an object that mimics the structure of what .all() returns
            const listingData = {
                publicKey: listingPda,
                account: listingAccount
            };
            listingMap.set(itemPda.toBase58(), listingData);
        } catch (e) {
            // This is expected if the item is not listed.
            console.log(`Item ID ${itemId} is not listed.`);
        }

        // 3. Process the item with the (potentially empty) listing map
        const results = await processItems([itemPda], listingMap);
        return results.length > 0 ? results[0] : null;

      } catch (err) {
        console.error(`Failed to fetch item details for ID ${itemId}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [program, processItems]
  );

  const fetchHomepageItems = useCallback(async (limit: number = 6): Promise<OnchainItem[]> => {
    if (!program) return [];

    setLoading(true);
    setError(null);

    try {
      const listings = await program.account.listing.all();
      const paginatedListings = listings.slice(0, limit);

      if (paginatedListings.length === 0) return [];

      const itemPdas = paginatedListings.map(l => l.account.item);
      const listingMap = new Map(paginatedListings.map(l => [l.account.item.toBase58(), l]));

      return await processItems(itemPdas, listingMap);

    } catch (err) {
      console.error("Failed to fetch homepage items:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [program, processItems]);

  const fetchUserItems = useCallback(async (userPublicKey: PublicKey): Promise<OnchainItem[]> => {
    if (!program) return [];

    setLoading(true);
    setError(null);

    try {
      // Offsets based on the IDL structure of the 'item' account
      const DISCRIMINATOR_SIZE = 8;
      const ITEM_ID_SIZE = 8;
      const SKU_HASH_SIZE = 32;
      const VAULT_STRING_PREFIX_SIZE = 4;
      const MAX_VAULT_SIZE = 128; // Must match the space in the contract
      const STATUS_SIZE = 1;
      const CURRENT_OWNER_OFFSET = DISCRIMINATOR_SIZE + ITEM_ID_SIZE + SKU_HASH_SIZE + VAULT_STRING_PREFIX_SIZE + MAX_VAULT_SIZE + STATUS_SIZE;

      // 1. Fetch items the user currently owns (InVault, Sold, RedeemPending, Redeemed)
      const ownedItems = await program.account.item.all([
        { memcmp: { offset: CURRENT_OWNER_OFFSET, bytes: userPublicKey.toBase58() } }
      ]);
      const ownedItemPdas = ownedItems.map(item => item.publicKey);

      // 2. Fetch items the user has listed for sale
      const LISTING_SELLER_OFFSET = 8 + 32; // discriminator + item_pubkey
      const userListings = await program.account.listing.all([
          { memcmp: { offset: LISTING_SELLER_OFFSET, bytes: userPublicKey.toBase58() } }
      ]);
      const listedItemPdas = userListings.map(l => l.account.item);

      // 3. Combine and deduplicate PDAs
      const allPdas = [...ownedItemPdas, ...listedItemPdas];
      const uniquePdaStrings = [...new Set(allPdas.map(pda => pda.toBase58()))];
      const uniquePdas = uniquePdaStrings.map(pdaStr => new PublicKey(pdaStr));

      if (uniquePdas.length === 0) return [];

      // 4. Create a listing map for processing
      const listingMap = new Map(userListings.map(l => [l.account.item.toBase58(), l]));

      return await processItems(uniquePdas, listingMap);

    } catch (err) {
      console.error(`Failed to fetch items for user ${userPublicKey.toBase58()}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [program, processItems]);

  const fetchUserInventory = useCallback(async (userPublicKey: PublicKey): Promise<OnchainItem[]> => {
    if (!program) return [];
    setLoading(true);
    setError(null);
    try {
      const DISCRIMINATOR_SIZE = 8;
      const ITEM_ID_SIZE = 8;
      const SKU_HASH_SIZE = 32;
      const VAULT_STRING_PREFIX_SIZE = 4;
      const MAX_VAULT_SIZE = 128;
      const STATUS_OFFSET = DISCRIMINATOR_SIZE + ITEM_ID_SIZE + SKU_HASH_SIZE + VAULT_STRING_PREFIX_SIZE + MAX_VAULT_SIZE;
      const CURRENT_OWNER_OFFSET = STATUS_OFFSET + 1;

      // 1. Fetch items owned by user with status 'inVault' (enum variant 0)
      const inVaultItems = await program.account.item.all([
          { memcmp: { offset: CURRENT_OWNER_OFFSET, bytes: userPublicKey.toBase58() } },
          { memcmp: { offset: STATUS_OFFSET, bytes: bs58.encode(Buffer.from([0])) } }
      ]);
      const inVaultPdas = inVaultItems.map(item => item.publicKey);

      // 2. Fetch items listed by the user
      const LISTING_SELLER_OFFSET = 8 + 32; // discriminator + item_pubkey
      const userListings = await program.account.listing.all([
          { memcmp: { offset: LISTING_SELLER_OFFSET, bytes: userPublicKey.toBase58() } }
      ]);
      const listedItemPdas = userListings.map(l => l.account.item);

      const allPdas = [...inVaultPdas, ...listedItemPdas];
      const uniquePdaStrings = [...new Set(allPdas.map(pda => pda.toBase58()))];
      const uniquePdas = uniquePdaStrings.map(pdaStr => new PublicKey(pdaStr));

      if (uniquePdas.length === 0) return [];

      const listingMap = new Map(userListings.map(l => [l.account.item.toBase58(), l]));
      return await processItems(uniquePdas, listingMap);

    } catch (err) {
      console.error(`Failed to fetch inventory for user ${userPublicKey.toBase58()}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setLoading(false);
    }
  }, [program, processItems]);

  const fetchUserPurchases = useCallback(async (userPublicKey: PublicKey): Promise<OnchainItem[]> => {
    if (!program) return [];
    setLoading(true);
    setError(null);
    try {
        // --- 获取所有商品，然后在客户端进行过滤 ---
        const allItems = await program.account.item.all();

        // --- 过滤出用户购买的 "Sold", "RedeemPending", "Redeemed" 状态的商品 ---
        const purchasedItems = allItems.filter(item =>
            item.account.currentOwner.equals(userPublicKey) &&
            ('sold' in item.account.status || 'redeemPending' in item.account.status || 'redeemed' in item.account.status)
        );

        if (purchasedItems.length === 0) return [];

        const itemPdas = purchasedItems.map(item => item.publicKey);
        return await processItems(itemPdas);

    } catch (err) {
        console.error(`Failed to fetch purchases for user ${userPublicKey.toBase58()}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        return [];
    } finally {
        setLoading(false);
    }
  }, [program, processItems]);

  return { loading, error, fetchAllListedItems, fetchItemDetails, fetchHomepageItems, fetchUserInventory, fetchUserPurchases };
}

