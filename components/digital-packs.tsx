import Link from "next/link"
import { ArrowRight } from "lucide-react"

const packs = [
  {
    id: 1,
    name: "Rookie Pack",
    price: 25,
    image: "/purple-trading-card-pack-reveal.jpg",
    gradient: "from-purple-600 to-purple-900",
  },
  {
    id: 2,
    name: "Starter Hoops Pack",
    price: 25,
    image: "/orange-basketball-card-pack.jpg",
    gradient: "from-orange-600 to-orange-900",
  },
  {
    id: 3,
    name: "Elite Pack",
    price: 50,
    image: "/red-trading-card-pack.jpg",
    gradient: "from-red-600 to-red-900",
  },
  {
    id: 4,
    name: "East Blue Pack",
    price: 80,
    image: "/yellow-pokemon-card-pack.jpg",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: 5,
    name: "Legend Pack",
    price: 250,
    image: "/black-premium-card-pack.jpg",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    id: 6,
    name: "Platinum Hoops Pack",
    price: 500,
    image: "/silver-platinum-card-pack.jpg",
    gradient: "from-gray-400 to-gray-600",
  },
]

export function DigitalPacks() {
  return (
    <section className="px-12 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Digital Packs, Physical Cards</h2>
        <Link
          href="/packs"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Open
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {packs.map((pack) => (
          <div key={pack.id} className="group flex-shrink-0 w-[240px]">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-card border border-border">
              <img
                src={pack.image || "/placeholder.svg"}
                alt={pack.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-3 space-y-2 h-[72px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium truncate pr-2">{pack.name}</h3>
                <span className="text-sm font-bold whitespace-nowrap">${pack.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-md">
                  <button className="px-2 py-1 hover:bg-accent transition-colors">-</button>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-12 text-center bg-transparent border-x border-border py-1 text-sm"
                  />
                  <button className="px-2 py-1 hover:bg-accent transition-colors">+</button>
                </div>
                <button className="flex-1 bg-foreground text-background hover:bg-foreground/90 transition-colors py-1.5 rounded-md text-sm font-medium">
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
