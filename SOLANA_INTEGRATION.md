# Solana Marketplace Integration

This document describes the integration of the Kaiwu Solana program for managing physical collectible items (graded Pokemon cards) as NFTs.

## Program Details

- **Program ID**: `62XmxPoMk15LdgH8a8UWgyj9wLTXfjcswL3UDBVSS8NG`
- **Network**: Solana Mainnet/Devnet
- **Framework**: Anchor

## Architecture

### Smart Contract Features

The Kaiwu program manages the lifecycle of physical items with the following states:

1. **InVault** - Item is stored in physical vault
2. **Listed** - Item is listed for sale on marketplace
3. **Sold** - Item has been purchased
4. **RedeemPending** - Owner has requested physical redemption
5. **Redeemed** - Physical item has been shipped to owner

### Key Instructions

#### 1. Buy Item (`buyItem`)
Purchase a listed item from the marketplace.

**Accounts:**
- `config` - Marketplace configuration (PDA)
- `item` - Item account (writable)
- `receipt` - Ownership receipt (writable)
- `listing` - Active listing (writable)
- `buyer` - Buyer wallet (signer, writable)
- `seller` - Seller wallet (writable)
- `treasury` - Platform treasury (writable)

**Flow:**
1. Buyer connects wallet
2. Buyer clicks "Buy Now" on product detail page
3. Transaction transfers SOL from buyer to seller (minus platform fee)
4. Item ownership transfers to buyer
5. Listing is closed

#### 2. List Item (`listItem`)
List an owned item for sale.

**Parameters:**
- `priceLamports` - Price in lamports (1 SOL = 1,000,000,000 lamports)
- `expiresAt` - Unix timestamp when listing expires

**Accounts:**
- `item` - Item account (writable)
- `receipt` - Ownership receipt (writable)
- `listing` - New listing PDA (writable)
- `currentOwner` - Item owner (signer, writable)

**Flow:**
1. Owner navigates to their item
2. Owner sets price and expiration
3. Transaction creates listing
4. Item status changes to "Listed"

#### 3. Delist Item (`delistItem`)
Remove an item from active listings.

**Accounts:**
- `item` - Item account (writable)
- `receipt` - Ownership receipt (writable)
- `listing` - Active listing (writable)
- `currentOwner` - Item owner (signer, writable)

**Flow:**
1. Owner clicks "Delist" on their listed item
2. Transaction closes listing
3. Item status returns to "InVault"

#### 4. Redeem Request (`redeemRequest`)
Request physical redemption of owned item.

**Accounts:**
- `item` - Item account (writable)
- `receipt` - Ownership receipt (writable)
- `currentOwner` - Item owner (signer, writable)

**Flow:**
1. Owner clicks "Redeem Physical Item"
2. Transaction updates item status to "RedeemPending"
3. Backend system processes shipping
4. Operator confirms with `redeemConfirm` instruction

## Frontend Integration

### Files Structure

\`\`\`
lib/
  idl/
    kaiwu.ts              # Program IDL type definitions
  solana/
    program.ts            # Program helpers and PDA derivation
hooks/
  use-marketplace.ts      # React hook for marketplace operations
components/
  product-detail.tsx      # Product page with buy/redeem actions
  marketplace-grid.tsx    # Marketplace listing grid
  wallet-provider.tsx     # Solana wallet adapter setup
\`\`\`

### Usage Example

\`\`\`typescript
import { useMarketplace } from '@/hooks/use-marketplace'

function ProductPage() {
  const { buyItem, redeemRequest, connected } = useMarketplace()

  const handleBuy = async () => {
    if (!connected) {
      // Prompt wallet connection
      return
    }
    
    try {
      const signature = await buyItem(itemId)
      console.log('Purchase successful:', signature)
    } catch (error) {
      console.error('Purchase failed:', error)
    }
  }

  return (
    <button onClick={handleBuy}>
      Buy Now
    </button>
  )
}
\`\`\`

### PDA Derivation

The program uses Program Derived Addresses (PDAs) for deterministic account generation:

\`\`\`typescript
// Config PDA: ["config"]
const [configPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("config")],
  PROGRAM_ID
)

// Item PDA: ["item", itemId (u64 LE)]
const [itemPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("item"), itemId.toArrayLike(Buffer, "le", 8)],
  PROGRAM_ID
)

// Listing PDA: ["listing", itemPubkey]
const [listingPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("listing"), itemPubkey.toBuffer()],
  PROGRAM_ID
)

// Receipt PDA: ["receipt", itemPubkey]
const [receiptPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("receipt"), itemPubkey.toBuffer()],
  PROGRAM_ID
)
\`\`\`

## Testing

### Prerequisites

1. Install Phantom or Solflare wallet
2. Get devnet SOL from faucet: https://faucet.solana.com/
3. Connect wallet to devnet

### Test Flow

1. **Browse Marketplace**
   - Navigate to `/marketplace`
   - View available items

2. **Purchase Item**
   - Click on an item
   - Click "Buy Now"
   - Approve transaction in wallet
   - Verify ownership transfer

3. **Redeem Physical Item**
   - Navigate to owned item
   - Click "Redeem Physical Item"
   - Approve transaction
   - Wait for shipping confirmation

## Security Considerations

1. **Wallet Connection**: Always verify wallet is connected before transactions
2. **Price Validation**: Confirm prices match listing before purchase
3. **Expiration Checks**: Validate listing hasn't expired
4. **Owner Verification**: Ensure only item owner can list/delist/redeem
5. **Fee Calculation**: Platform fee is calculated on-chain (configured in `config.feeBps`)

## Future Enhancements

- [ ] Add offer system for negotiated pricing
- [ ] Implement auction functionality
- [ ] Add batch operations for multiple items
- [ ] Integrate with Metaplex for NFT metadata
- [ ] Add escrow for disputed transactions
- [ ] Implement royalty system for original creators

## Support

For issues or questions about the Solana integration:
- Check transaction on Solana Explorer: https://explorer.solana.com/
- Review program logs for error messages
- Verify wallet has sufficient SOL for transaction + fees
