"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { BackgroundEffects } from "@/components/background-effects"
import { CardDisplay } from "@/components/card-detail/card-display"
import { InformationPanel } from "@/components/card-detail/information-panel"
import { CardInspectionModal } from "@/components/card-detail/card-inspection-modal"
import { PriceChart } from "@/components/card-detail/price-chart"
import { OwnershipHistory } from "@/components/card-detail/ownership-history"
import { RelatedCards } from "@/components/card-detail/related-cards"

// Mock card data - in a real app, this would come from an API
const getCardData = (id: string) => ({
  id: "001",
  name: "ELECTRIC SURGE",
  setName: "NEO THUNDER",
  setNumber: "001/150",
  rarity: "legendary" as const,
  condition: "NM",
  conditionGrade: "A+",
  conditionDescription: "Near Mint - Minor edge wear, excellent centering",
  price: 1250,
  priceChange24h: 12.5,
  lastSalePrice: 1100,
  lastSaleDate: "2025-01-15",
  floorPrice: 1100,
  imageUrl: "/electric-pokemon-card.png",
  backImageUrl: "/electric-pokemon-card-back.png",
  holographicImageUrl: "/electric-pokemon-card-holo.png",
  authenticated: true,
  authenticationHash: "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
  blockchainTxHash: "0x1234567890abcdef1234567890abcdef12345678",
  editionNumber: 42,
  printRun: 1000,
  owner: {
    address: "0xD8a6F7992c37d5A89f8d5DB1579F16fF42a7b809",
    username: "CardMaster_2025",
    avatar: "/placeholder-avatar.png",
    verified: true,
  },
  seller: {
    address: "0xF3a1B2c3D4e5F6789012345678901234567890ab",
    username: "EliteTrader",
    rating: 4.9,
    totalSales: 247,
  },
  priceHistory: [
    { date: "2025-01-01", price: 950 },
    { date: "2025-01-05", price: 1020 },
    { date: "2025-01-10", price: 1150 },
    { date: "2025-01-15", price: 1100 },
    { date: "2025-01-20", price: 1250 },
  ],
  ownershipHistory: [
    {
      owner: "0xD8a6F7992c37d5A89f8d5DB1579F16fF42a7b809",
      date: "2025-01-20",
      price: 1100,
      txHash: "0xabc123...",
    },
    {
      owner: "0xF3a1B2c3D4e5F6789012345678901234567890ab",
      date: "2025-01-15",
      price: 950,
      txHash: "0xdef456...",
    },
  ],
})

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const [cardData] = useState(() => getCardData(params.id))
  const [isInspectionOpen, setIsInspectionOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"front" | "back" | "holo">("front")
  const [isWatchlisted, setIsWatchlisted] = useState(false)

  // Sound effects
  const playSound = (soundType: "hover" | "click" | "success") => {
    // In a real app, you would implement actual sound effects here
    console.log(`Playing ${soundType} sound`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      <BackgroundEffects />
      <Navigation />

      <main className="pt-24 pb-32 relative z-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 min-h-screen">
            {/* Hero Card Display - Left 60% */}
            <div className="lg:col-span-3">
              <CardDisplay
                card={cardData}
                currentView={currentView}
                onViewChange={setCurrentView}
                onInspectionOpen={() => setIsInspectionOpen(true)}
                onSound={playSound}
              />
            </div>

            {/* Information Panel - Right 40% */}
            <div className="lg:col-span-2">
              <InformationPanel
                card={cardData}
                isWatchlisted={isWatchlisted}
                onWatchlistToggle={() => setIsWatchlisted(!isWatchlisted)}
                onSound={playSound}
              />
            </div>
          </div>

          {/* Additional Sections */}
          <div className="mt-32 space-y-32">
            <PriceChart data={cardData.priceHistory} currentPrice={cardData.price} />
            <OwnershipHistory history={cardData.ownershipHistory} />
            <RelatedCards currentCard={cardData} />
          </div>
        </div>
      </main>

      {/* Card Inspection Modal */}
      <CardInspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        card={cardData}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    </div>
  )
}
