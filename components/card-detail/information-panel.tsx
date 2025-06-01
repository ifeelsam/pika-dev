"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { Copy, Heart, Share2, MessageCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InformationPanelProps {
  card: any
  isWatchlisted: boolean
  onWatchlistToggle: () => void
  onSound: (soundType: "hover" | "click" | "success") => void
}

export function InformationPanel({ card, isWatchlisted, onWatchlistToggle, onSound }: InformationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "#F6FF00"
      case "epic":
        return "#FF2D55"
      case "rare":
        return "#00F5FF"
      default:
        return "#FFFFFF"
    }
  }

  const rarityColor = getRarityColor(card.rarity)

  // Panel entrance animation
  useEffect(() => {
    if (panelRef.current) {
      gsap.set(panelRef.current, {
        x: 100,
        opacity: 0,
      })

      gsap.to(panelRef.current, {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.8,
      })
    }
  }, [])

  // Price update animation
  useEffect(() => {
    if (priceRef.current) {
      gsap.fromTo(
        priceRef.current,
        { scale: 1 },
        {
          scale: 1.15,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        },
      )
    }
  }, [card.price])

  // Copy hash function
  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    onSound("success")
    setTimeout(() => setCopied(false), 2000)
  }

  // Truncate hash
  const truncateHash = (hash: string) => `${hash.slice(0, 8)}...${hash.slice(-8)}`

  return (
    <div ref={panelRef} className="relative h-full flex flex-col justify-center space-y-8">
      {/* Primary Information Block */}
      <div className="space-y-6">
        {/* Card name */}
        <div className="relative">
          <h1
            className="text-4xl md:text-5xl font-black leading-tight"
            style={{ fontFamily: "'Monument Extended', sans-serif" }}
          >
            <span className="text-white">{card.name}</span>
            <span className="text-pikavault-yellow ml-4">#{card.setNumber}</span>
          </h1>

          {/* Rarity indicator */}
          <div
            className="absolute -top-2 -right-4 w-24 h-6 transform rotate-12"
            style={{
              background: `linear-gradient(45deg, ${rarityColor}, ${rarityColor}80)`,
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span
                className="text-xs font-bold text-pikavault-dark"
                style={{ fontFamily: "'Monument Extended', sans-serif" }}
              >
                {card.rarity.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Set name */}
        <p className="text-xl text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {card.setName}
        </p>

        {/* Price */}
        <div ref={priceRef} className="space-y-2">
          <div className="flex items-baseline space-x-4">
            <h2
              className="text-6xl md:text-7xl font-black text-pikavault-pink"
              style={{ fontFamily: "'Monument Extended', sans-serif" }}
            >
              ${card.price}
            </h2>
            <div
              className={`text-xl font-bold ${card.priceChange24h >= 0 ? "text-pikavault-cyan" : "text-pikavault-pink"}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {card.priceChange24h >= 0 ? "+" : ""}
              {card.priceChange24h}%
            </div>
          </div>

          <div className="flex items-center space-x-4 text-white/50">
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Floor: ${card.floorPrice}</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Last: ${card.lastSalePrice}</span>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="space-y-4 border-l-4 border-white/20 pl-6">
        <h3 className="text-xl font-bold text-white/70" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
          SPECIFICATIONS
        </h3>

        <div className="space-y-3">
          {/* Condition */}
          <div className="flex justify-between items-center">
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Condition</span>
            <div className="flex items-center space-x-2">
              <span
                className="text-2xl font-black"
                style={{ fontFamily: "'Monument Extended', sans-serif", color: rarityColor }}
              >
                {card.conditionGrade}
              </span>
              <span className="text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                ({card.condition})
              </span>
            </div>
          </div>

          {/* Edition */}
          <div className="flex justify-between items-center">
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Edition</span>
            <span className="font-mono text-[#00FF85]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {card.editionNumber}/{card.printRun}
            </span>
          </div>

          {/* Authentication */}
          <div className="flex justify-between items-center">
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Auth Hash</span>
            <button
              onClick={() => copyHash(card.authenticationHash)}
              className="flex items-center space-x-2 text-white/70 hover:text-pikavault-yellow transition-colors"
            >
              <span className="font-mono text-sm">{truncateHash(card.authenticationHash)}</span>
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Blockchain verification */}
          <div className="flex justify-between items-center">
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Blockchain</span>
            <a
              href={`https://etherscan.io/tx/${card.blockchainTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-pikavault-cyan hover:text-pikavault-cyan/80 transition-colors"
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Verified</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Action Interface */}
      <div className="space-y-4">
        {/* Primary CTA */}
        <Button
          className="w-full bg-pikavault-yellow hover:bg-pikavault-yellow/90 text-pikavault-dark text-xl font-black py-6 rounded-none transition-all duration-300 hover:scale-105"
          style={{ fontFamily: "'Monument Extended', sans-serif" }}
          onClick={() => onSound("click")}
          onMouseEnter={() => onSound("hover")}
        >
          BUY NOW
        </Button>

        {/* Secondary CTA */}
        <Button
          className="w-full bg-transparent border-4 border-pikavault-pink hover:bg-pikavault-pink/10 text-white text-lg font-bold py-4 rounded-none transition-all duration-300"
          style={{ fontFamily: "'Monument Extended', sans-serif" }}
          onClick={() => onSound("click")}
          onMouseEnter={() => onSound("hover")}
        >
          MAKE OFFER
        </Button>

        {/* Utility actions */}
        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={() => {
              onWatchlistToggle()
              onSound("click")
            }}
            className={`p-4 border-2 transition-all duration-300 ${
              isWatchlisted
                ? "bg-pikavault-pink/20 border-pikavault-pink text-pikavault-pink"
                : "bg-transparent border-white/30 text-white hover:border-white/60"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWatchlisted ? "fill-current" : ""}`} />
          </Button>

          <Button
            onClick={() => onSound("click")}
            className="p-4 bg-transparent border-2 border-white/30 text-white hover:border-white/60 transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => onSound("click")}
            className="p-4 bg-transparent border-2 border-white/30 text-white hover:border-white/60 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Seller information */}
      <div className="border-t border-white/20 pt-6">
        <h4 className="text-lg font-bold mb-4" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
          SELLER
        </h4>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {card.seller.username}
            </p>
            <p className="text-white/70 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {card.seller.rating}/5 • {card.seller.totalSales} sales
            </p>
          </div>

          <Button
            onClick={() => onSound("click")}
            className="bg-pikavault-cyan hover:bg-pikavault-cyan/90 text-pikavault-dark font-bold px-6 py-2 rounded-none"
            style={{ fontFamily: "'Monument Extended', sans-serif" }}
          >
            CONTACT
          </Button>
        </div>
      </div>

      {/* Copy notification */}
      {copied && (
        <div className="fixed top-24 right-8 bg-[#00FF85] text-pikavault-dark px-4 py-2 font-bold z-50">
          Hash copied to clipboard!
        </div>
      )}
    </div>
  )
}
