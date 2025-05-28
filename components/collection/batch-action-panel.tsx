"use client"

import { useRef, useEffect } from "react"
import { X, Tag, Share2, ArrowRight } from "lucide-react"
import { useCollection } from "./collection-context"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

interface BatchActionPanelProps {
  selectedCards: string[]
  onClearSelection: () => void
}

export function BatchActionPanel({ selectedCards, onClearSelection }: BatchActionPanelProps) {
  const { cards } = useCollection()
  const panelRef = useRef<HTMLDivElement>(null)

  // Get selected card details
  const selectedCardDetails = cards.filter((card) => selectedCards.includes(card.id))

  // Calculate total value
  const totalValue = selectedCardDetails.reduce((sum, card) => sum + card.value, 0)

  // Animation for panel
  useEffect(() => {
    if (panelRef.current) {
      // Initial state
      gsap.set(panelRef.current, {
        y: 100,
        opacity: 0,
      })

      // Animate in
      gsap.to(panelRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "cubic-bezier(0.17, 0.67, 0.83, 0.67)",
      })
    }

    return () => {
      if (panelRef.current) {
        // Animate out
        gsap.to(panelRef.current, {
          y: 100,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        })
      }
    }
  }, [])

  return (
    <div ref={panelRef} className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t-4 border-[#F6FF00] z-40 p-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <button onClick={onClearSelection} className="p-2 text-white/70 hover:text-[#F6FF00] transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div>
            <p className="text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {selectedCards.length} CARDS SELECTED
            </p>
            <p className="text-xl font-black text-white" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              TOTAL: <span className="text-[#F6FF00]">${totalValue}</span>
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            className="bg-[#FF2D55] hover:bg-[#FF2D55]/90 text-white font-bold py-4 px-6 rounded-none flex items-center space-x-2"
            style={{ fontFamily: "'Monument Extended', sans-serif" }}
          >
            <Tag className="w-5 h-5" />
            <span>LIST ALL</span>
          </Button>

          <Button
            className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0A0A0A] font-bold py-4 px-6 rounded-none flex items-center space-x-2"
            style={{ fontFamily: "'Monument Extended', sans-serif" }}
          >
            <ArrowRight className="w-5 h-5" />
            <span>TRANSFER</span>
          </Button>

          <Button
            className="bg-transparent border-4 border-white/30 hover:border-white/60 text-white font-bold py-4 px-6 rounded-none flex items-center space-x-2"
            style={{ fontFamily: "'Monument Extended', sans-serif" }}
          >
            <Share2 className="w-5 h-5" />
            <span>SHARE</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
