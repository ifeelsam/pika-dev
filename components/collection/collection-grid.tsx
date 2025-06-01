"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useCollection } from "./collection-context"
import { gsap } from "gsap"
import { Check, Eye, Share2, Tag } from "lucide-react"

interface CollectionGridProps {
  selectedCards: string[]
  setSelectedCards: (cards: string[]) => void
}

export function CollectionGrid({ selectedCards, setSelectedCards }: CollectionGridProps) {
  const { filteredCards, viewMode } = useCollection()
  const gridRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [contextMenuCard, setContextMenuCard] = useState<string | null>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [isAnimated, setIsAnimated] = useState(false)

  // Grid animation
  useEffect(() => {
    if (gridRef.current) {
      // Set initial state - hidden
      gsap.set(gridRef.current.children, {
        y: 100,
        opacity: 0,
      })

      // Animate cards into view
      gsap.to(gridRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.7,
        onComplete: () => {
          setIsAnimated(true)
        },
      })
    }
  }, [])

  // Toggle card selection
  const toggleCardSelection = (cardId: string, event: React.MouseEvent) => {
    // If shift key is pressed, add to selection without removing others
    if (event.shiftKey) {
      if (selectedCards.includes(cardId)) {
        setSelectedCards(selectedCards.filter((id) => id !== cardId))
      } else {
        setSelectedCards([...selectedCards, cardId])
      }
    } else {
      // Normal click behavior
      if (selectedCards.includes(cardId)) {
        setSelectedCards(selectedCards.filter((id) => id !== cardId))
      } else {
        setSelectedCards([cardId])
      }
    }
  }

  // Handle context menu
  const handleContextMenu = (event: React.MouseEvent, cardId: string) => {
    event.preventDefault()
    setContextMenuCard(cardId)
    setContextMenuPosition({ x: event.clientX, y: event.clientY })
  }

  // Close context menu
  const closeContextMenu = () => {
    setContextMenuCard(null)
  }

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

  // Get rarity shape
  const getRarityShape = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" // Diamond
      case "epic":
        return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" // Square
      case "rare":
        return "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" // Pentagon
      default:
        return "circle(50% at 50% 50%)" // Circle
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div>
      {viewMode === "grid" ? (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredCards.map((card, index) => {
            const isSelected = selectedCards.includes(card.id)
            const isHovered = hoveredCard === card.id
            const rarityColor = getRarityColor(card.rarity)
            const rarityShape = getRarityShape(card.rarity)

            // Calculate grid disruption
            const offsetX = index % 3 === 0 ? "-10px" : index % 3 === 1 ? "10px" : "0px"
            const offsetY = index % 2 === 0 ? "-15px" : "15px"

            return (
              <div
                key={card.id}
                className="relative"
                style={{
                  transform: `translateX(${offsetX}) translateY(${offsetY})`,
                  // Only apply opacity after GSAP animation is complete
                  opacity: isAnimated ? 1 : 0,
                }}
              >
                <div
                  className={`
                    relative cursor-pointer group
                    ${isSelected ? "z-10" : "z-0"}
                  `}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={(e) => toggleCardSelection(card.id, e)}
                  onContextMenu={(e) => handleContextMenu(e, card.id)}
                  style={{
                    transform: `rotate(${card.rotation}deg) perspective(1000px) rotateY(15deg)`,
                    transition: "all 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
                  }}
                >
                  {/* Card container */}
                  <div
                    className={`
                      relative bg-pikavault-dark border-4 overflow-hidden transform-gpu
                      transition-all duration-300
                      ${
                        isSelected
                          ? `border-[${rarityColor}] scale-110 z-10`
                          : "border-white/30 group-hover:border-white/70"
                      }
                      ${isHovered && !isSelected ? "scale-[1.3]" : ""}
                    `}
                    style={{
                      boxShadow:
                        isSelected || isHovered
                          ? `18px 18px 30px 0px ${rarityColor}30`
                          : "18px 18px 0px 0px rgba(10,10,10,1)",
                    }}
                  >
                    {/* Card image */}
                    <div
                      className="w-full aspect-[3/4] bg-cover bg-center"
                      style={{ backgroundImage: `url(${card.imageUrl})` }}
                    >
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pikavault-dark/90"></div>

                      {/* Selection checkbox */}
                      <div
                        className={`
                          absolute top-3 right-3 w-8 h-8 flex items-center justify-center
                          transition-all duration-300
                          ${
                            isSelected
                              ? `bg-[${rarityColor}] border-[${rarityColor}]`
                              : "bg-pikavault-dark/70 border-white/30 opacity-0 group-hover:opacity-100"
                          }
                          border-2
                        `}
                        style={{ clipPath: rarityShape }}
                      >
                        {isSelected && <Check className="w-5 h-5 text-pikavault-dark" />}
                      </div>

                      {/* Rarity indicator */}
                      <div
                        className="absolute top-3 left-3 w-6 h-6"
                        style={{
                          backgroundColor: rarityColor,
                          clipPath: rarityShape,
                        }}
                      ></div>

                      {/* Ownership marker - diagonal slash */}
                      <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                        <div
                          className="absolute top-0 left-0 w-24 h-6 bg-pikavault-yellow rotate-45 origin-top-left"
                          style={{ transform: "rotate(45deg) translate(-3px, -10px)" }}
                        >
                          <p
                            className="text-pikavault-dark text-[10px] font-bold text-center"
                            style={{ fontFamily: "'Monument Extended', sans-serif" }}
                          >
                            OWNED
                          </p>
                        </div>
                      </div>

                      {/* Price comparison */}
                      <div
                        className={`
                          absolute top-3 right-12 px-2 py-1
                          ${card.priceChange >= 0 ? "bg-pikavault-cyan" : "bg-pikavault-pink"}
                        `}
                      >
                        <p
                          className="text-pikavault-dark text-sm font-bold"
                          style={{ fontFamily: "'Monument Extended', sans-serif" }}
                        >
                          {card.priceChange >= 0 ? "+" : ""}
                          {card.priceChange}%
                        </p>
                      </div>

                      {/* Card content */}
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h3
                          className="text-white text-xl font-bold leading-relaxed mb-1"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {card.name}
                        </h3>

                        <div className="flex justify-between items-center">
                          <p className="text-white/70 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            #{card.id}
                          </p>
                          <p
                            className="text-white font-black"
                            style={{ fontFamily: "'Monument Extended', sans-serif" }}
                          >
                            ${card.value}
                          </p>
                        </div>
                      </div>

                      {/* Quick action buttons (visible on hover) */}
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center bg-pikavault-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex space-x-4">
                            <button className="p-3 bg-pikavault-yellow text-pikavault-dark">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-pikavault-pink text-white">
                              <Tag className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-pikavault-cyan text-pikavault-dark">
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Empty slots */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="relative"
              style={{
                // Only apply opacity after GSAP animation is complete
                opacity: isAnimated ? 1 : 0,
              }}
            >
              <div className="aspect-[3/4] border-4 border-dashed border-white/20 flex items-center justify-center">
                <div className="text-pikavault-yellow text-5xl">+</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={gridRef} className="space-y-4">
          {filteredCards.map((card, index) => {
            const isSelected = selectedCards.includes(card.id)
            const rarityColor = getRarityColor(card.rarity)

            return (
              <div
                key={card.id}
                className={`
                  relative bg-pikavault-dark border-l-4 p-4 cursor-pointer
                  ${isSelected ? `border-[${rarityColor}]` : "border-white/30"}
                  transition-all duration-300 hover:bg-white/5
                `}
                style={{
                  // Only apply opacity after GSAP animation is complete
                  opacity: isAnimated ? 1 : 0,
                }}
                onClick={(e) => toggleCardSelection(card.id, e)}
                onContextMenu={(e) => handleContextMenu(e, card.id)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`
                      w-6 h-6 flex items-center justify-center
                      ${isSelected ? `bg-[${rarityColor}]` : "bg-white/10"}
                      transition-all duration-300
                    `}
                  >
                    {isSelected && <Check className="w-4 h-4 text-pikavault-dark" />}
                  </div>

                  <div
                    className="w-12 h-16 bg-cover bg-center border-2"
                    style={{
                      backgroundImage: `url(${card.imageUrl})`,
                      borderColor: rarityColor,
                    }}
                  ></div>

                  <div className="flex-1">
                    <h3 className="text-white font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {card.name}
                    </h3>
                    <p className="text-white/70 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      #{card.id} • {formatDate(card.acquiredDate)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div>
                      <p
                        className={`text-sm ${card.priceChange >= 0 ? "text-pikavault-cyan" : "text-pikavault-pink"}`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {card.priceChange >= 0 ? "+" : ""}
                        {card.priceChange}%
                      </p>
                    </div>

                    <p
                      className="text-white font-black text-xl"
                      style={{ fontFamily: "'Monument Extended', sans-serif" }}
                    >
                      ${card.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Context menu */}
      {contextMenuCard && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeContextMenu}></div>
          <div
            className="fixed z-50 bg-pikavault-dark border-4 border-pikavault-yellow p-2 w-48"
            style={{
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
            }}
          >
            <div className="space-y-1">
              <button className="w-full text-left p-2 hover:bg-white/10 text-white flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>View Details</span>
              </button>
              <button className="w-full text-left p-2 hover:bg-white/10 text-white flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>List for Sale</span>
              </button>
              <button className="w-full text-left p-2 hover:bg-white/10 text-white flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Share Card</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Custom scrollbar */}
      <div className="fixed top-0 right-0 h-full w-4 z-20 pointer-events-none hidden md:block">
        <div className="h-full w-1 bg-pikavault-yellow/20 mx-auto">
          <div className="w-full h-20 bg-pikavault-yellow opacity-50"></div>
        </div>
        {/* Measurement marks */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="absolute w-4 h-1 bg-pikavault-yellow"
            style={{ top: `${(index + 1) * 10}%`, right: 0 }}
          ></div>
        ))}
      </div>
    </div>
  )
}
