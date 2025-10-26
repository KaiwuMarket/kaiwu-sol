import Link from "next/link"

const relatedCards = [
  {
    id: 2,
    name: "Pikachu VMAX",
    grade: "PSA 9",
    price: 28.3,
    image: "/pokemon-card-graded-slab-green.jpg",
  },
  {
    id: 3,
    name: "Mewtwo GX",
    grade: "BGS 10",
    price: 67.8,
    image: "/pokemon-card-graded-slab-pink.jpg",
  },
  {
    id: 4,
    name: "Rayquaza VMAX",
    grade: "PSA 10",
    price: 89.2,
    image: "/pokemon-card-graded-slab-blue.jpg",
  },
]

export function RelatedProducts() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Cards</h2>
      <div className="space-y-4">
        {relatedCards.map((card) => (
          <Link key={card.id} href={`/product/${card.id}`} className="block group">
            <div className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:border-muted transition-colors">
              <div className="w-20 h-28 flex-shrink-0 bg-secondary/50 rounded overflow-hidden">
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold mb-1 line-clamp-2">{card.name}</h3>
                  <p className="text-xs text-muted-foreground">{card.grade}</p>
                </div>
                <p className="font-bold">{card.price} SOL</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
