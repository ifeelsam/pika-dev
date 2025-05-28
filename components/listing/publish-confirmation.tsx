"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { Check, ExternalLink } from "lucide-react"
import Link from "next/link"

interface PublishConfirmationProps {
  cardData: any
  uploadedImages: string[]
}

export function PublishConfirmation({ cardData, uploadedImages }: PublishConfirmationProps) {
  const confirmationRef = useRef<HTMLDivElement>(null)

  // Animation for confirmation
  useEffect(() => {
    if (confirmationRef.current) {
      gsap.from(confirmationRef.current.children, {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      })
    }
  }, [])

  // Mock transaction hash
  const txHash = "0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730"

  return (
    <div ref={confirmationRef} className="max-w-3xl mx-auto text-center space-y-12">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-[#F6FF00] rounded-full flex items-center justify-center mb-8">
          <Check className="w-12 h-12 text-[#0A0A0A]" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
          CARD TOKENIZED!
        </h2>

        <p className="text-xl text-white/70 max-w-2xl mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Your card has been successfully tokenized and listed on the PikaVault marketplace. You can view your listing
          and track its status in your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border-4 border-white/30 p-6">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            CARD DETAILS
          </h3>

          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Card Name</span>
              <span className="font-bold" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
                {cardData.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Set</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{cardData.set}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Condition</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{cardData.condition}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Price</span>
              <span className="text-[#FF2D55] font-bold" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
                ${cardData.price || cardData.suggestedPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border-4 border-white/30 p-6">
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            BLOCKCHAIN DETAILS
          </h3>

          <div className="space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Status</span>
              <span className="text-[#00F5FF] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Confirmed
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Transaction</span>
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-white/70 hover:text-[#F6FF00] transition-colors"
              >
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {`${txHash.slice(0, 6)}...${txHash.slice(-4)}`}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Token ID</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>#12345</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Timestamp</span>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Link
          href="/card/001"
          className="inline-block px-8 py-4 bg-[#F6FF00] text-[#0A0A0A] font-bold text-lg"
          style={{ fontFamily: "'Monument Extended', sans-serif" }}
        >
          VIEW LISTING
        </Link>

        <div className="flex justify-center space-x-6 mt-4">
          <Link
            href="/marketplace"
            className="text-white/70 hover:text-[#F6FF00] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Go to Marketplace
          </Link>
          <Link
            href="/collection"
            className="text-white/70 hover:text-[#F6FF00] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            View My Collection
          </Link>
        </div>
      </div>
    </div>
  )
}
