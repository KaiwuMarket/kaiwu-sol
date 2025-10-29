import { HeroSection } from "@/components/hero-section"
import { RecentPulls } from "@/components/recent-pulls"
// import { DigitalPacks } from "@/components/digital-packs"
// import { CollectorLeaderboard } from "@/components/collector-leaderboard"
import { CommunityTestimonials } from "@/components/community-testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <RecentPulls />
      {/* <DigitalPacks /> */}
      {/* <CollectorLeaderboard /> */}
      <CommunityTestimonials />
    </div>
  )
}
