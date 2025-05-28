"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { BackgroundEffects } from "@/components/background-effects"
import { UploadZone } from "@/components/listing/upload-zone"
import { CardInformationPanel } from "@/components/listing/card-information-panel"
import { ListingPreview } from "@/components/listing/listing-preview"
import { VerificationProcess } from "@/components/listing/verification-process"
import { PublishConfirmation } from "@/components/listing/publish-confirmation"
import { CustomToast } from "@/components/ui/custom-toast"
import { useWalletProtection } from "@/hooks/use-wallet-protection"
import { gsap } from "gsap"

export default function ListingPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [cardData, setCardData] = useState({
    name: "",
    set: "",
    number: "",
    rarity: "",
    language: "English",
    condition: "",
    conditionNotes: "",
    price: 0,
    suggestedPrice: 0,
    listingType: "fixed",
    duration: "7d",
    isGraded: false,
    gradingCompany: "",
    gradingScore: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  const { isWalletConnected, showToast, requireWalletConnection, handleWalletConnect, handleToastClose } =
    useWalletProtection()

  // Check wallet connection on page load
  useEffect(() => {
    if (!requireWalletConnection()) {
      // Toast will be shown automatically
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (cardData.name && isWalletConnected) {
        console.log("Auto-saving listing...")
        // In a real app, this would save to localStorage or backend
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [cardData, isWalletConnected])

  // Page entrance animation
  useEffect(() => {
    if (pageRef.current && isWalletConnected) {
      gsap.from(pageRef.current.children, {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      })
    }
  }, [isWalletConnected])

  // Handle image upload
  const handleImageUpload = (images: string[]) => {
    if (!requireWalletConnection()) return

    setUploadedImages(images)
    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false)
      // Auto-populate card data based on "detected" information
      if (images.length > 0) {
        setCardData({
          ...cardData,
          name: "ELECTRIC SURGE",
          set: "NEO THUNDER",
          number: "001/150",
          rarity: "legendary",
          suggestedPrice: 1250,
        })
      }
    }, 3000)
  }

  // Update card data
  const updateCardData = (data: Partial<typeof cardData>) => {
    if (!requireWalletConnection()) return

    setCardData({ ...cardData, ...data })
  }

  // Handle step navigation
  const nextStep = () => {
    if (!requireWalletConnection()) return

    if (activeStep < 3) {
      setActiveStep(activeStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Publish listing
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setIsPublished(true)
      }, 2000)
    }
  }

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Sound effects
  const playSound = (soundType: "hover" | "click" | "success" | "error") => {
    // In a real app, you would implement actual sound effects here
    console.log(`Playing ${soundType} sound`)
  }

  // Show wallet connection requirement if not connected
  if (!isWalletConnected) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-black mb-8" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              WALLET REQUIRED
            </h1>
            <p className="text-xl text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Connect your wallet to access the listing page
            </p>
          </div>
        </div>
        <CustomToast
          isVisible={showToast}
          onClose={handleToastClose}
          onConnect={handleWalletConnect}
          type="wallet_required"
          message="WALLET NOT CONNECTED"
          secondaryMessage="Connect your wallet to list cards"
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
      <BackgroundEffects />
      <Navigation />

      <main ref={pageRef} className="pt-24 pb-32 px-4 md:px-8 lg:px-12 relative z-10">
        <div className="container mx-auto">
          <h1
            className="text-5xl md:text-7xl font-black mb-8 tracking-tight"
            style={{ fontFamily: "'Monument Extended', sans-serif" }}
          >
            TOKENIZE <span className="text-[#F6FF00]">YOUR CARD</span>
          </h1>

          <p className="text-xl text-white/70 max-w-3xl mb-16" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Transform your physical Pokémon cards into digital assets on the blockchain. Our secure process ensures
            authenticity and provides a permanent record of ownership.
          </p>

          {!isPublished ? (
            <>
              {/* Progress indicator */}
              <div className="w-full h-4 bg-white/10 mb-16 relative">
                <div
                  className="h-full bg-[#F6FF00]"
                  style={{
                    width: `${(activeStep + 1) * 25}%`,
                    transition: "width 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
                  }}
                ></div>
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`absolute top-0 w-4 h-4 transform -translate-x-1/2 transition-all duration-300 ${
                      step <= activeStep ? "bg-[#F6FF00]" : "bg-white/20"
                    }`}
                    style={{ left: `${step * 25 + 25}%` }}
                  ></div>
                ))}
              </div>

              {/* Step title */}
              <h2
                className="text-3xl md:text-4xl font-black mb-12"
                style={{ fontFamily: "'Monument Extended', sans-serif" }}
              >
                {activeStep === 0 && "STEP 1: UPLOAD PHOTOS"}
                {activeStep === 1 && "STEP 2: CARD DETAILS"}
                {activeStep === 2 && "STEP 3: CONDITION & PRICING"}
                {activeStep === 3 && "STEP 4: VERIFICATION"}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left column */}
                <div>
                  {activeStep === 0 && (
                    <UploadZone
                      onImageUpload={handleImageUpload}
                      uploadedImages={uploadedImages}
                      isProcessing={isProcessing}
                      onSound={playSound}
                    />
                  )}
                  {activeStep === 1 && (
                    <CardInformationPanel cardData={cardData} updateCardData={updateCardData} onSound={playSound} />
                  )}
                  {activeStep === 2 && (
                    <VerificationProcess cardData={cardData} updateCardData={updateCardData} onSound={playSound} />
                  )}
                  {activeStep === 3 && (
                    <div className="space-y-8">
                      <div className="bg-white/5 border-4 border-[#F6FF00] p-8">
                        <h3
                          className="text-2xl font-black mb-6"
                          style={{ fontFamily: "'Monument Extended', sans-serif" }}
                        >
                          FINAL VERIFICATION
                        </h3>
                        <p className="text-white/70 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Your card has been verified and is ready to be tokenized on the blockchain. Please review all
                          details before publishing.
                        </p>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Card Name</span>
                            <span className="font-bold" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
                              {cardData.name}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Set</span>
                            <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {cardData.set}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Condition</span>
                            <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {cardData.condition}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Price</span>
                            <span
                              className="font-bold text-[#FF2D55]"
                              style={{ fontFamily: "'Monument Extended', sans-serif" }}
                            >
                              ${cardData.price || cardData.suggestedPrice}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Listing Type</span>
                            <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {cardData.listingType === "fixed" ? "Fixed Price" : "Auction"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Duration</span>
                            <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {cardData.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column */}
                <div>
                  <ListingPreview cardData={cardData} uploadedImages={uploadedImages} isProcessing={isProcessing} />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-16">
                <button
                  onClick={() => {
                    if (activeStep !== 0) {
                      playSound("click")
                      prevStep()
                    }
                  }}
                  disabled={activeStep === 0}
                  className={`px-8 py-4 border-4 transition-all duration-300 ${
                    activeStep === 0
                      ? "border-white/20 text-white/50 cursor-not-allowed"
                      : "border-white/50 text-white hover:border-white"
                  }`}
                  style={{ fontFamily: "'Monument Extended', sans-serif" }}
                  onMouseEnter={() => activeStep !== 0 && playSound("hover")}
                >
                  PREVIOUS
                </button>

                <button
                  onClick={() => {
                    if (
                      !(
                        (activeStep === 0 && uploadedImages.length === 0) ||
                        (activeStep === 1 && (!cardData.name || !cardData.set || !cardData.rarity)) ||
                        (activeStep === 2 && !cardData.condition)
                      )
                    ) {
                      playSound(activeStep === 3 ? "success" : "click")
                      nextStep()
                    }
                  }}
                  disabled={
                    (activeStep === 0 && uploadedImages.length === 0) ||
                    (activeStep === 1 && (!cardData.name || !cardData.set || !cardData.rarity)) ||
                    (activeStep === 2 && !cardData.condition)
                  }
                  className={`px-8 py-4 transition-all duration-300 ${
                    (activeStep === 0 && uploadedImages.length === 0) ||
                    (activeStep === 1 && (!cardData.name || !cardData.set || !cardData.rarity)) ||
                    (activeStep === 2 && !cardData.condition)
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : activeStep === 3
                        ? "bg-[#F6FF00] text-[#0A0A0A] hover:bg-[#F6FF00]/90"
                        : "bg-[#00F5FF] text-[#0A0A0A] hover:bg-[#00F5FF]/90"
                  }`}
                  style={{ fontFamily: "'Monument Extended', sans-serif" }}
                  onMouseEnter={() => {
                    if (
                      !(
                        (activeStep === 0 && uploadedImages.length === 0) ||
                        (activeStep === 1 && (!cardData.name || !cardData.set || !cardData.rarity)) ||
                        (activeStep === 2 && !cardData.condition)
                      )
                    ) {
                      playSound("hover")
                    }
                  }}
                >
                  {activeStep === 3 ? "PUBLISH LISTING" : "NEXT STEP"}
                </button>
              </div>
            </>
          ) : (
            <PublishConfirmation cardData={cardData} uploadedImages={uploadedImages} />
          )}
        </div>
      </main>

      {/* Custom Toast */}
      <CustomToast
        isVisible={showToast}
        onClose={handleToastClose}
        onConnect={handleWalletConnect}
        type="wallet_required"
        message="WALLET NOT CONNECTED"
        secondaryMessage="Connect your wallet to list cards"
      />
    </div>
  )
}
