import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    username: "CardMaster2024",
    avatar: "/abstract-geometric-shapes.png",
    rating: 5,
    comment:
      "Just pulled a PSA 10 Charizard from the Elite Pack! This platform is incredible. The authentication process is seamless and I love that I can trade instantly.",
    date: "2 days ago",
  },
  {
    id: 2,
    username: "HoopsCollector",
    avatar: "/abstract-geometric-shapes.png",
    rating: 5,
    comment:
      "Best NFT marketplace for graded cards. The Solana integration makes transactions super fast and cheap. Already made 3 purchases this week!",
    date: "3 days ago",
  },
  {
    id: 3,
    username: "PokemonTrader99",
    avatar: "/diverse-group-collaborating.png",
    rating: 5,
    comment:
      "Love the leaderboard feature! It's so fun competing with other collectors. The pack opening experience is addictive.",
    date: "5 days ago",
  },
  {
    id: 4,
    username: "GradedGems",
    avatar: "/abstract-geometric-shapes.png",
    rating: 5,
    comment:
      "Finally a platform that understands collectors. The grading information is detailed and the marketplace is easy to navigate. Highly recommend!",
    date: "1 week ago",
  },
]

export function CommunityTestimonials() {
  return (
    <section className="px-12 py-12">
      <h2 className="text-3xl font-bold mb-6">What Collectors Are Saying</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border border-border rounded-lg p-6 hover:border-accent transition-colors"
          >
            <div className="flex items-start gap-4">
              <img
                src={testimonial.avatar || "/placeholder.svg"}
                alt={testimonial.username}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{testimonial.username}</h3>
                  <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
