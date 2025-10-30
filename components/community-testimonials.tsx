import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    username: "LabubuLover88",
    avatar: "/abstract-geometric-shapes.png",
    rating: 5,
    comment:
      "Just pulled a rare “Pop Mart × Labubu Forest Spirit” from the limited blind box! The authentication and warehousing process was seamless, and I could list it for trade instantly — super convenient!",
    date: "2 days ago",
  },
  {
    id: 2,
    username: "FigureHunter",
    avatar: "/abstract-geometric-shapes.png",
    rating: 5,
    comment:
      "The best trading platform for designer toys! The on-chain certification makes transactions fast and secure — already added three Labubus to my collection this week!",
    date: "3 days ago",
  },
  {
    id: 3,
    username: "GradedToys",
    avatar: "/diverse-group-collaborating.png",
    rating: 5,
    comment:
      "Finally, a platform that truly understands Labubu collectors. Every piece comes with grading and authenticity proof, and the interface is super easy to use. Highly recommend!",
    date: "5 days ago",
  },
  {
    id: 4,
    username: "PopMartGirl",
    avatar: "/abstract-geometric-shapes.png",
    rating: 5,
    comment:
      "The storage-and-trade feature is so practical — I can list items right after sending them in, without worrying about shipping. The interface is clean, and it’s super easy to find rare editions!",
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
