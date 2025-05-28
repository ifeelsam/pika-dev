import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { CardCollection } from "@/components/card-collection"
import { Footer } from "@/components/footer"
import { BackgroundEffects } from "@/components/background-effects"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      <BackgroundEffects />
      <Navigation />
      <HeroSection />
      <CardCollection />
      <Footer />
    </div>
  )
}
