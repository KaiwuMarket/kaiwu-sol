"use client"

import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useOnchainData, OnchainItem } from "@/hooks/use-onchain-data"

export function RecentPulls() {
  const { fetchHomepageItems, loading } = useOnchainData()
  const [items, setItems] = useState<OnchainItem[]>([])

  useEffect(() => {
    fetchHomepageItems().then(setItems)
  }, [fetchHomepageItems])

  if (loading) {
    return (
        <section className="px-12 py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Recent Pulls</h2>
            </div>
            <div className="flex items-center justify-center min-h-[300px]">
                <div className="flex items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading latest items from the blockchain...</span>
                </div>
            </div>
        </section>
    )
  }

  return (
    <section className="px-12 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Recent Pulls</h2>
        <Link
          href="/marketplace"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View Marketplace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <Link
            key={item.pda}
            href={`/product/${item.itemId}`}
            className="group flex-shrink-0 w-[280px]"
          >
            <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-muted transition-colors h-full flex flex-col">
              <div className="aspect-[2/3] relative bg-secondary/50">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-4 h-[88px] flex flex-col justify-between">
                <p className="text-sm font-medium mb-2 truncate">
                  {item.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">
                    {item.listing ? `${item.listing.priceSol.toFixed(2)} SOL` : "Not Listed"}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    On-chain
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
