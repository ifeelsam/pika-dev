"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type SortOption = "name" | "value" | "rarity" | "date"
type ViewMode = "grid" | "list"
type SortDirection = "asc" | "desc"

type FilterType = {
  id: string
  label: string
  options: {
    id: string
    label: string
    active: boolean
  }[]
}

export type CardType = {
  id: string
  name: string
  rarity: "common" | "rare" | "epic" | "legendary"
  value: number
  floorPrice: number
  priceChange: number
  imageUrl: string
  rotation: number
  acquiredDate: string
  collection: string
}

type CollectionContextType = {
  cards: CardType[]
  filteredCards: CardType[]
  filters: FilterType[]
  toggleFilter: (filterId: string, optionId: string) => void
  resetFilters: () => void
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  sortDirection: SortDirection
  setSortDirection: (direction: SortDirection) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  totalValue: number
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export function CollectionProvider({ children }: { children: ReactNode }) {
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
      id: "value",
      label: "VaLuE",
      options: [
        { id: "under-100", label: "< 100", active: false },
        { id: "100-500", label: "100-500", active: false },
        { id: "500-1000", label: "500-1000", active: false },
        { id: "over-1000", label: "> 1000", active: false },
      ],
    },
  ])

  const [sortOption, setSortOption] = useState<SortOption>("value")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Card data
  const [cards] = useState<CardType[]>([
    {
      id: "001",
      name: "ELECTRIC SURGE",
      rarity: "legendary",
      value: 1250,
      floorPrice: 1100,
      priceChange: 12.5,
      imageUrl: "/electric-pokemon-card.png",
      rotation: -3,
      acquiredDate: "2025-01-15",
      collection: "neo-thunder",
    },
    {
      id: "042",
      name: "CYBER STRIKE",
      rarity: "epic",
      value: 750,
      floorPrice: 720,
      priceChange: 4.2,
      imageUrl: "/cyber-pokemon-card.png",
      rotation: 2,
      acquiredDate: "2025-02-03",
      collection: "neo-thunder",
    },
    {
      id: "107",
      name: "DIGITAL WAVE",
      rarity: "rare",
      value: 320,
      floorPrice: 350,
      priceChange: -8.6,
      imageUrl: "/digital-wave-pokemon-card.png",
      rotation: -1,
      acquiredDate: "2025-02-28",
      collection: "neo-thunder",
    },
    {
      id: "023",
      name: "NEON BLAST",
      rarity: "epic",
      value: 680,
      floorPrice: 650,
      priceChange: 4.6,
      imageUrl: "/neon-pokemon-card.png",
      rotation: 3,
      acquiredDate: "2025-03-12",
      collection: "pixel-pulse",
    },
    {
      id: "056",
      name: "PIXEL STORM",
      rarity: "rare",
      value: 420,
      floorPrice: 400,
      priceChange: 5.0,
      imageUrl: "/pixel-art-pokemon-storm-card.png",
      rotation: -2,
      acquiredDate: "2025-01-30",
      collection: "pixel-pulse",
    },
    {
      id: "089",
      name: "QUANTUM LEAP",
      rarity: "legendary",
      value: 1580,
      floorPrice: 1400,
      priceChange: 12.9,
      imageUrl: "/quantum-leap-pokemon-card.png",
      rotation: 1,
      acquiredDate: "2025-04-05",
      collection: "pixel-pulse",
    },
    {
      id: "112",
      name: "STATIC PULSE",
      rarity: "common",
      value: 85,
      floorPrice: 90,
      priceChange: -5.6,
      imageUrl: "/static-electricity-card.png",
      rotation: -3,
      acquiredDate: "2025-03-22",
      collection: "void-runners",
    },
    {
      id: "073",
      name: "VOID RUNNER",
      rarity: "epic",
      value: 890,
      floorPrice: 850,
      priceChange: 4.7,
      imageUrl: "/placeholder-oai5n.png",
      rotation: 2,
      acquiredDate: "2025-02-18",
      collection: "void-runners",
    },
    {
      id: "118",
      name: "GLITCH KING",
      rarity: "legendary",
      value: 2100,
      floorPrice: 1950,
      priceChange: 7.7,
      imageUrl: "/glitch-king-pokemon-card.png",
      rotation: -1,
      acquiredDate: "2025-01-05",
      collection: "void-runners",
    },
  ])

  // Calculate total value
  const totalValue = cards.reduce((sum, card) => sum + card.value, 0)

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
  }

  // Apply filters and sorting to cards
  const filteredCards = cards
    .filter((card) => {
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
        } else if (filter.id === "value") {
          const matchesValue = activeOptions.some((option) => {
            if (option.id === "under-100") return card.value < 100
            if (option.id === "100-500") return card.value >= 100 && card.value <= 500
            if (option.id === "500-1000") return card.value > 500 && card.value <= 1000
            if (option.id === "over-1000") return card.value > 1000
            return false
          })

          if (!matchesValue) {
            return false
          }
        }
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortOption === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortOption === "value") {
        return sortDirection === "asc" ? a.value - b.value : b.value - a.value
      } else if (sortOption === "rarity") {
        const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 }
        return sortDirection === "asc"
          ? rarityOrder[a.rarity] - rarityOrder[b.rarity]
          : rarityOrder[b.rarity] - rarityOrder[a.rarity]
      } else if (sortOption === "date") {
        return sortDirection === "asc"
          ? new Date(a.acquiredDate).getTime() - new Date(b.acquiredDate).getTime()
          : new Date(b.acquiredDate).getTime() - new Date(a.acquiredDate).getTime()
      }
      return 0
    })

  return (
    <CollectionContext.Provider
      value={{
        cards,
        filteredCards,
        filters,
        toggleFilter,
        resetFilters,
        sortOption,
        setSortOption,
        sortDirection,
        setSortDirection,
        viewMode,
        setViewMode,
        totalValue,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider")
  }
  return context
}
