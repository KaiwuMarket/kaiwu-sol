import { PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"
import { IDL } from "../idl/kaiwu"

export const PROGRAM_ID = new PublicKey(IDL.address)

// PDA seeds
export const CONFIG_SEED = Buffer.from("config")
export const ITEM_SEED = Buffer.from("item")
export const LISTING_SEED = Buffer.from("listing")
export const RECEIPT_SEED = Buffer.from("receipt")

// Helper to get config PDA
export function getConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([CONFIG_SEED], PROGRAM_ID)
}

// Helper to get item PDA
export function getItemPDA(itemId: BN): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([ITEM_SEED, itemId.toArrayLike(Buffer, "le", 8)], PROGRAM_ID)
}

// Helper to get listing PDA
export function getListingPDA(itemPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([LISTING_SEED, itemPubkey.toBuffer()], PROGRAM_ID)
}

// Helper to get receipt PDA
export function getReceiptPDA(itemPubkey: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([RECEIPT_SEED, itemPubkey.toBuffer()], PROGRAM_ID)
}

export interface ItemData {
  itemId: BN
  skuHash: number[]
  vaultHash: number[]
  status: { inVault?: {}; listed?: {}; sold?: {}; redeemPending?: {}; redeemed?: {} }
  currentOwner: PublicKey
  createdAt: BN
  bump: number
}

export interface ListingData {
  item: PublicKey
  seller: PublicKey
  priceLamports: BN
  expiresAt: BN
  active: boolean
  bump: number
}

export interface ReceiptData {
  item: PublicKey
  owner: PublicKey
  state: { inVault?: {}; listed?: {}; sold?: {}; redeemPending?: {}; redeemed?: {} }
  bump: number
}

// Convert lamports to SOL
export function lamportsToSol(lamports: BN | number): number {
  const lamportsNum = typeof lamports === "number" ? lamports : lamports.toNumber()
  return lamportsNum / 1_000_000_000
}

// Convert SOL to lamports
export function solToLamports(sol: number): BN {
  return new BN(Math.floor(sol * 1_000_000_000))
}
