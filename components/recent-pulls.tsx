import Link from "next/link"
import { ArrowRight } from "lucide-react"

const recentCards = [
  {
    id: 1,
    name: "2025 Pokemon Japanese SV Terasta",
    image: "/pokemon-card-graded-slab.jpg",
    time: "58s ago",
    pack: "Rookie Pack",
  },
  {
    id: 2,
    name: "2024 Pokemon Scarlet & Violet",
    image: "/pokemon-card-graded-slab-green.jpg",
    time: "3m ago",
    pack: "Elite Pack",
  },
  {
    id: 3,
    name: "2023 Pokemon Japanese SWSH",
    image: "/pokemon-card-graded-slab-pink.jpg",
    time: "2m ago",
    pack: "Elite Pack",
  },
  {
    id: 4,
    name: "2002 Pokemon Expedition Holo",
    image: "/pokemon-card-graded-slab-blue.jpg",
    time: "3m ago",
    pack: "Mythic Pack",
  },
  {
    id: 5,
    name: "2023 POKEMON JPN SVZA",
    image: "/pokemon-card-graded-slab-red.jpg",
    time: "3m ago",
    pack: "Rookie Pack",
  },
  {
    id: 6,
    name: "2023 POKEMON MEW EN",
    image: "/pokemon-card-graded-slab-purple.jpg",
    time: "4m ago",
    pack: "Mythic Pack",
  },
]

export function RecentPulls() {
  return (
    <section className="px-12 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Recent Pulls</h2>
        <Link
          href="/marketplace"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Open Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {recentCards.map((card) => (
          <Link key={card.id} href={`/product/${card.id}`} className="group flex-shrink-0 w-[280px]">
            <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-muted transition-colors h-full flex flex-col">
              <div className="aspect-[2/3] relative bg-secondary/50">
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs">
                  {card.time}
                </div>
              </div>
              <div className="p-4 h-[88px] flex flex-col justify-between">
                <p className="text-sm font-medium mb-2 truncate">{card.name}</p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{card.pack}</span>
                  <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">Just revealed</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
