"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type FilterType = {
  id: string
  label: string
  options: {
    id: string
    label: string
    active: boolean
  }[]
}

type CardType = {
  id: string
  name: string
  rarity: "common" | "rare" | "epic" | "legendary"
  price: number
  imageUrl: string
  rotation: number
  owner: string
  collection: string
}

type MarketplaceContextType = {
  filters: FilterType[]
  toggleFilter: (filterId: string, optionId: string) => void
  resetFilters: () => void
  cards: CardType[]
  filteredCards: CardType[]
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  // Filter data
  const [filters, setFilters] = useState<FilterType[]>([
    {
      id: "rarity",
      label: "RaRiTy",
      options: [
        { id: "common", label: "COMMON", active: false },
        { id: "rare", label: "RARE", active: false },
        { id: "epic", label: "EPIC", active: false },
        { id: "legendary", label: "LEGENDARY", active: false },
      ],
    },
    {
      id: "collection",
      label: "CoLlEcTiOn",
      options: [
        { id: "neo-thunder", label: "NEO THUNDER", active: false },
        { id: "pixel-pulse", label: "PIXEL PULSE", active: false },
        { id: "void-runners", label: "VOID RUNNERS", active: false },
      ],
    },
    {
      id: "price",
      label: "PrIcE",
      options: [
        { id: "under-100", label: "< 100", active: false },
        { id: "100-500", label: "100-500", active: false },
        { id: "500-1000", label: "500-1000", active: false },
        { id: "over-1000", label: "> 1000", active: false },
      ],
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  // Card data
  const [cards] = useState<CardType[]>([
    {
      id: "001",
      name: "ELECTRIC SURGE",
      rarity: "legendary",
      price: 1250,
      imageUrl: "/electric-pokemon-card.png",
      rotation: -3,
      owner: "0xD8...42a7",
      collection: "neo-thunder",
    },
    {
      id: "042",
      name: "CYBER STRIKE",
      rarity: "epic",
      price: 750,
      imageUrl: "/cyber-pokemon-card.png",
      rotation: 2,
      owner: "0xF3...91b2",
      collection: "neo-thunder",
    },
    {
      id: "107",
      name: "DIGITAL WAVE",
      rarity: "rare",
      price: 320,
      imageUrl: "/digital-wave-pokemon-card.png",
      rotation: -1,
      owner: "0x72...f5e8",
      collection: "neo-thunder",
    },
    {
      id: "023",
      name: "NEON BLAST",
      rarity: "epic",
      price: 680,
      imageUrl: "/neon-pokemon-card.png",
      rotation: 3,
      owner: "0xA1...c4d9",
      collection: "pixel-pulse",
    },
    {
      id: "056",
      name: "PIXEL STORM",
      rarity: "rare",
      price: 420,
      imageUrl: "/pixel-art-pokemon-storm-card.png",
      rotation: -2,
      owner: "0x58...3fa1",
      collection: "pixel-pulse",
    },
    {
      id: "089",
      name: "QUANTUM LEAP",
      rarity: "legendary",
      price: 1580,
      imageUrl: "/quantum-leap-pokemon-card.png",
      rotation: 1,
      owner: "0xB7...2e6c",
      collection: "pixel-pulse",
    },
    {
      id: "112",
      name: "STATIC PULSE",
      rarity: "common",
      price: 85,
      imageUrl: "/static-electricity-card.png",
      rotation: -3,
      owner: "0x39...7d4e",
      collection: "void-runners",
    },
    {
      id: "073",
      name: "VOID RUNNER",
      rarity: "epic",
      price: 890,
      imageUrl: "/placeholder-oai5n.png",
      rotation: 2,
      owner: "0xE2...8b3a",
      collection: "void-runners",
    },
    {
      id: "118",
      name: "GLITCH KING",
      rarity: "legendary",
      price: 2100,
      imageUrl: "/glitch-king-pokemon-card.png",
      rotation: -1,
      owner: "0x91...6f5d",
      collection: "void-runners",
    },
    {
      id: "135",
      name: "BINARY BEAST",
      rarity: "epic",
      price: 720,
      imageUrl: "/binary-beast-pokemon-card.png",
      rotation: 3,
      owner: "0x4C...9a2b",
      collection: "neo-thunder",
    },
    {
      id: "149",
      name: "CRYPTO CRUSH",
      rarity: "rare",
      price: 350,
      imageUrl: "/crypto-crush-card.png",
      rotation: -2,
      owner: "0x67...1d8e",
      collection: "pixel-pulse",
    },
    {
      id: "162",
      name: "NEURAL NEXUS",
      rarity: "common",
      price: 95,
      imageUrl: "/neural-nexus-pokemon-card.png",
      rotation: 1,
      owner: "0xF9...3c7a",
      collection: "void-runners",
    },
  ])

  // Toggle filter option
  const toggleFilter = (filterId: string, optionId: string) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id === filterId) {
          return {
            ...filter,
            options: filter.options.map((option) => {
              if (option.id === optionId) {
                return { ...option, active: !option.active }
              }
              return option
            }),
          }
        }
        return filter
      }),
    )
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters(
      filters.map((filter) => ({
        ...filter,
        options: filter.options.map((option) => ({
          ...option,
          active: false,
        })),
      })),
    )
    setSearchQuery("")
  }

  // Apply filters to cards
  const filteredCards = cards.filter((card) => {
    // Check if card matches search query
    if (
      searchQuery &&
      !card.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !card.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Check if card matches active filters
    for (const filter of filters) {
      const activeOptions = filter.options.filter((option) => option.active)

      // Skip filter if no options are active
      if (activeOptions.length === 0) continue

      // Check if card matches any active option in this filter
      if (filter.id === "rarity") {
        if (!activeOptions.some((option) => option.id === card.rarity)) {
          return false
        }
      } else if (filter.id === "collection") {
        if (!activeOptions.some((option) => option.id === card.collection)) {
          return false
        }
      } else if (filter.id === "price") {
        const matchesPrice = activeOptions.some((option) => {
          if (option.id === "under-100") return card.price < 100
          if (option.id === "100-500") return card.price >= 100 && card.price <= 500
          if (option.id === "500-1000") return card.price > 500 && card.price <= 1000
          if (option.id === "over-1000") return card.price > 1000
          return false
        })

        if (!matchesPrice) {
          return false
        }
      }
    }

    return true
  })

  return (
    <MarketplaceContext.Provider
      value={{
        filters,
        toggleFilter,
        resetFilters,
        cards,
        filteredCards,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  )
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext)
  if (context === undefined) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider")
  }
  return context
}
