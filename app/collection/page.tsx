"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { CollectionHeader } from "@/components/collection/collection-header"
import { StatsBar } from "@/components/collection/stats-bar"
import { CollectionGrid } from "@/components/collection/collection-grid"
import { EmptyState } from "@/components/collection/empty-state"
import { DisconnectedState } from "@/components/collection/disconnected-state"
import { BatchActionPanel } from "@/components/collection/batch-action-panel"
import { BackgroundEffects } from "@/components/background-effects"
import { CollectionProvider } from "@/components/collection/collection-context"
import { useWalletProtection } from "@/hooks/use-wallet-protection"

export default function CollectionPage() {
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasCards, setHasCards] = useState(false)
  const { isWalletConnected } = useWalletProtection()

  // Simulate loading state
  useEffect(() => {
    if (isWalletConnected) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        // For demo purposes, we'll set hasCards to true
        // In a real app, this would be determined by checking if the user has cards
        setHasCards(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isWalletConnected])

  // Show disconnected state if wallet is not connected
  if (!isWalletConnected) {
    return (
      <>
        <Navigation />
        <DisconnectedState />
      </>
    )
  }

  return (
    <CollectionProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden relative">
        <BackgroundEffects />
        <Navigation />

        <main className="pt-24 pb-32 px-4 md:px-8 lg:px-12 relative z-10">
          <CollectionHeader />

          {isLoading ? (
            <div className="mt-12">
              <div className="h-12 w-full max-w-4xl bg-white/10 animate-pulse mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="aspect-[3/4] bg-white/5 animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : hasCards ? (
            <>
              <StatsBar />
              <CollectionGrid selectedCards={selectedCards} setSelectedCards={setSelectedCards} />
              {selectedCards.length > 0 && (
                <BatchActionPanel selectedCards={selectedCards} onClearSelection={() => setSelectedCards([])} />
              )}
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </CollectionProvider>
  )
}
