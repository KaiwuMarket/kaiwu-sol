"use client"

import { MarketplaceGrid } from "@/components/marketplace-grid"
import { MarketplaceFilters } from "@/components/marketplace-filters"
import { useState } from "react"

export default function MarketplacePage() {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <div className="min-h-screen">
      <div className="px-12 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Browse and trade graded Pokemon cards as NFTs on Solana</p>
        </div>

        <MarketplaceGrid showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)} />
        <MarketplaceFilters isVisible={showFilters} onToggle={() => setShowFilters(!showFilters)} />
      </div>
    </div>
  )
}
