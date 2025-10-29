import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-[500px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
      <img
        src="/basketball-player-action-shot-dark.jpg"
        alt="Basketball hero"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-20 h-full flex items-center px-12">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-bold mb-6 text-balance">Basketball Packs</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Open a digital pack to instantly reveal a real Labubu. Choose to hold, trade, redeem, or sell it back to us at
            85% value!
          </p>
          <Button size="lg" className="gap-2">
            View Drop
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
