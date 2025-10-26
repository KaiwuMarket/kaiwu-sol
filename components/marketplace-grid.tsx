"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Grid3x3, List, ArrowUpDown, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMarketplace } from "@/hooks/use-marketplace"

const marketplaceCards = [
  {
    id: 1,
    itemId: 1,
    name: "Charizard VMAX",
    set: "Darkness Ablaze",
    grade: "PSA 10",
    price: 45.5,
    image: "/pokemon-card-graded-slab.jpg",
    rarity: "Ultra Rare",
  },
  {
    id: 2,
    itemId: 2,
    name: "Pikachu VMAX",
    set: "Vivid Voltage",
    grade: "PSA 9",
    price: 28.3,
    image: "/pokemon-card-graded-slab-green.jpg",
    rarity: "Holo Rare",
  },
  {
    id: 3,
    itemId: 3,
    name: "Mewtwo GX",
    set: "Shining Legends",
    grade: "BGS 10",
    price: 67.8,
    image: "/pokemon-card-graded-slab-pink.jpg",
    rarity: "Ultra Rare",
  },
  {
    id: 4,
    itemId: 4,
    name: "Rayquaza VMAX",
    set: "Evolving Skies",
    grade: "PSA 10",
    price: 89.2,
    image: "/pokemon-card-graded-slab-blue.jpg",
    rarity: "Ultra Rare",
  },
  {
    id: 5,
    itemId: 5,
    name: "Umbreon VMAX",
    set: "Evolving Skies",
    grade: "PSA 9",
    price: 125.5,
    image: "/pokemon-card-graded-slab-red.jpg",
    rarity: "Ultra Rare",
  },
  {
    id: 6,
    itemId: 6,
    name: "Gengar VMAX",
    set: "Fusion Strike",
    grade: "PSA 10",
    price: 34.7,
    image: "/pokemon-card-graded-slab-purple.jpg",
    rarity: "Holo Rare",
  },
  {
    id: 7,
    itemId: 7,
    name: "Lugia V",
    set: "Silver Tempest",
    grade: "PSA 10",
    price: 52.3,
    image: "/pokemon-card-graded-slab.jpg",
    rarity: "Ultra Rare",
  },
  {
    id: 8,
    itemId: 8,
    name: "Mew VMAX",
    set: "Fusion Strike",
    grade: "BGS 10",
    price: 78.9,
    image: "/pokemon-card-graded-slab-green.jpg",
    rarity: "Ultra Rare",
  },
  {
    id: 9,
    itemId: 9,
    name: "Giratina VSTAR",
    set: "Lost Origin",
    grade: "PSA 9",
    price: 41.2,
    image: "/pokemon-card-graded-slab-pink.jpg",
    rarity: "Holo Rare",
  },
  {
    id: 10,
    itemId: 10,
    name: "Arceus VSTAR",
    set: "Brilliant Stars",
    grade: "PSA 10",
    price: 56.8,
    image: "/pokemon-card-graded-slab-blue.jpg",
    rarity: "Ultra Rare",
  },
  {
    id: 11,
    itemId: 11,
    name: "Dialga VSTAR",
    set: "Brilliant Stars",
    grade: "PSA 9",
    price: 38.5,
    image: "/pokemon-card-graded-slab-red.jpg",
    rarity: "Holo Rare",
  },
  {
    id: 12,
    itemId: 12,
    name: "Palkia VSTAR",
    set: "Astral Radiance",
    grade: "PSA 10",
    price: 44.3,
    image: "/pokemon-card-graded-slab-purple.jpg",
    rarity: "Ultra Rare",
  },
]

export function MarketplaceGrid({
  showFilters,
  onToggleFilters,
}: { showFilters: boolean; onToggleFilters: () => void }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { connected } = useMarketplace()

  return (
    <div className={cn("flex-1 transition-all duration-300", showFilters && "mr-80")}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">Showing {marketplaceCards.length} cards</p>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onToggleFilters}>
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>

          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <ArrowUpDown className="w-4 h-4" />
            Price: Low to High
          </Button>

          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}>
        {marketplaceCards.map((card) => (
          <Link key={card.id} href={`/product/${card.id}`} className="group block">
            {viewMode === "grid" ? (
              <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-muted transition-colors h-[420px] flex flex-col">
                <div className="aspect-[2/3] relative bg-secondary/50 flex-shrink-0">
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.name}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                    {card.grade}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold mb-1 line-clamp-1">{card.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{card.set}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold">{card.price} SOL</span>
                      <span className="text-xs text-muted-foreground">{card.rarity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border hover:border-muted transition-colors p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-32 flex-shrink-0 bg-secondary/50 rounded overflow-hidden">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{card.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{card.set}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-secondary text-xs rounded">{card.grade}</span>
                        <span className="text-xs text-muted-foreground">{card.rarity}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{card.price} SOL</span>
                      <Button size="sm">Buy Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
