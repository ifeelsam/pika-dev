"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"

interface ListingPreviewProps {
  cardData: any
  uploadedImages: string[]
  isProcessing: boolean
}

export function ListingPreview({ cardData, uploadedImages, isProcessing }: ListingPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

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

  // Animation for preview
  useEffect(() => {
    if (previewRef.current) {
      gsap.from(previewRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
    }
  }, [])

  return (
    <div ref={previewRef} className="sticky top-32">
      <div className="bg-white/5 border-4 border-white/30 p-6">
        <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
          LISTING PREVIEW
        </h3>

        <div className="space-y-8">
          {/* Card preview */}
          <div className="relative aspect-[3/4] bg-[#0A0A0A] border-4 overflow-hidden">
            {uploadedImages.length > 0 ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${uploadedImages[0]})` }}
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]/90"></div>

                {/* Card content */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <div className="flex justify-between items-end">
                    <h3
                      className="text-white text-xl font-bold leading-tight"
                      style={{ fontFamily: "'Monument Extended', sans-serif" }}
                    >
                      {cardData.name || "CARD NAME"}
                    </h3>
                    {cardData.rarity && (
                      <div
                        className={`uppercase text-xs font-bold px-2 py-1`}
                        style={{
                          backgroundColor: getRarityColor(cardData.rarity),
                          color:
                            cardData.rarity === "common"
                              ? "#0A0A0A"
                              : cardData.rarity === "legendary"
                                ? "#0A0A0A"
                                : cardData.rarity === "epic"
                                  ? "#FFFFFF"
                                  : "#0A0A0A",
                        }}
                      >
                        {cardData.rarity.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-white/70 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {cardData.set ? `${cardData.set} • ` : ""}
                      {cardData.number || "#000/000"}
                    </p>
                  </div>
                </div>

                {/* Condition badge */}
                {cardData.condition && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-[#0A0A0A]/80 border border-white/50">
                    <p className="text-xs font-bold" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
                      {cardData.condition}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white/50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Upload images to preview
                </p>
              </div>
            )}
          </div>

          {/* Price preview */}
          {(cardData.price || cardData.suggestedPrice) > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Price</span>
                <span
                  className="text-3xl font-black text-[#FF2D55]"
                  style={{ fontFamily: "'Monument Extended', sans-serif" }}
                >
                  ${cardData.price || cardData.suggestedPrice}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Listing Type</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {cardData.listingType === "fixed" ? "Fixed Price" : "Auction"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Duration</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{cardData.duration}</span>
              </div>
            </div>
          )}

          {/* Tokenization preview */}
          <div className="space-y-4">
            <h4 className="font-bold" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              TOKENIZATION PREVIEW
            </h4>

            <div className="bg-[#0A0A0A] p-4 border-l-4 border-[#F6FF00] font-mono text-sm">
              <p className="text-[#F6FF00]">// Card will be tokenized with the following metadata</p>
              <p className="text-white/70">
                {`{
  "name": "${cardData.name || "Card Name"}",
  "set": "${cardData.set || "Set Name"}",
  "number": "${cardData.number || "000/000"}",
  "rarity": "${cardData.rarity || "common"}",
  "condition": "${cardData.condition || "NM"}",
  "language": "${cardData.language || "English"}",
  "isGraded": ${cardData.isGraded || false},
  ${cardData.isGraded ? `"gradingCompany": "${cardData.gradingCompany || ""}",` : ""}
  ${cardData.isGraded ? `"gradingScore": "${cardData.gradingScore || ""}",` : ""}
  "price": ${cardData.price || cardData.suggestedPrice || 0},
  "listingType": "${cardData.listingType || "fixed"}",
  "duration": "${cardData.duration || "7d"}"
}`}
              </p>
            </div>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="bg-[#0A0A0A] p-4 border-l-4 border-[#00F5FF] flex items-center space-x-4">
              <div className="w-6 h-6 border-4 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Processing card data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
