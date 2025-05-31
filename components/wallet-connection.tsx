"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Copy, ExternalLink, Check } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { WalletMobileSheet } from "./wallet-mobile-sheet"

// Mock wallet data
const mockWalletData = {
  address: "0xD8a6F7992c37d5A89f8d5DB1579F16fF42a7b809",
  balance: 1.245,
  network: "Ethereum",
  usdBalance: 2532.67,
}

export function WalletConnection() {
  const [connectionState, setConnectionState] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [walletData, setWalletData] = useState(mockWalletData)
  const [isCopied, setIsCopied] = useState(false)
  const [isDisconnectHovered, setIsDisconnectHovered] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle connect/disconnect
  const handleConnect = () => {
    if (connectionState === "disconnected") {
      // Start connecting animation
      setConnectionState("connecting")

      // Play sound effect
      playSound("click")

      // Simulate connection delay
      setTimeout(() => {
        setConnectionState("connected")
        playSound("success")
      }, 1000)
    } else if (connectionState === "connected") {
      // Toggle dropdown or mobile sheet based on screen size
      if (isMobile) {
        setIsMobileSheetOpen(!isMobileSheetOpen)
      } else {
        setIsDropdownOpen(!isDropdownOpen)
      }
      playSound("click")
    }
  }

  const handleDisconnect = () => {
    setConnectionState("disconnected")
    setIsDropdownOpen(false)
    setIsMobileSheetOpen(false)
    playSound("click")
  }

  // Copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address)
    setIsCopied(true)
    playSound("success")

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  // Sound effects
  const playSound = (type: "hover" | "click" | "success") => {
    // In a real app, you would implement actual sound effects here
    console.log(`Playing ${type} sound`)
  }

  // Truncate wallet address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Connect Button */}
      <button
        onClick={handleConnect}
        onMouseEnter={() => playSound("hover")}
        className={`
          relative overflow-hidden font-bold py-2 px-4 md:py-3 md:px-6 transition-all duration-300
          ${connectionState === "disconnected" ? "bg-[#F6FF00] text-[#0A0A0A]" : ""}
          ${connectionState === "connecting" ? "bg-[#FF2D55] text-white wallet-connecting scale-105" : ""}
          ${connectionState === "connected" ? "bg-[#00F5FF] text-[#0A0A0A]" : ""}
        `}
        style={{ fontFamily: "'Monument Extended', sans-serif" }}
      >
        {connectionState === "disconnected" && "CONNECT"}

        {connectionState === "connecting" && (
          <>
            <span className="glitch-text">CONNECTING...</span>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute top-0 left-0 w-full h-1 bg-white/30"
                  style={{ animation: "scan 1s linear infinite" }}
                ></div>
              </div>
            </div>
          </>
        )}

        {connectionState === "connected" && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#F6FF00]"></div>
            <span className="font-mono">{truncateAddress(walletData.address)}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        )}
      </button>

      {/* Dropdown for desktop */}
      {!isMobile && connectionState === "connected" && isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-[#0A0A0A]/95 border-4 border-[#00F5FF] z-50"
          style={{
            clipPath: "polygon(0 0, 100% 0, 95% 95%, 5% 100%)",
            animation: "fadeIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
          }}
        >
          <div className="p-4 space-y-4">
            {/* Wallet Address */}
            <div className="space-y-1">
              <p className="text-white/70 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                WALLET ADDRESS
              </p>
              <div className="flex items-center justify-between bg-[#0A0A0A] border border-white/20 p-2">
                <p className="font-mono text-white text-sm truncate">{walletData.address}</p>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:text-[#F6FF00] transition-colors"
                  onMouseEnter={() => playSound("hover")}
                >
                  {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Network Status */}
            <div className="flex justify-between items-center">
              <p className="text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                NETWORK
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {walletData.network}
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="space-y-1">
              <p className="text-white/70 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                BALANCE
              </p>
              <div className="flex justify-between items-baseline">
                <p
                  className="text-2xl font-black text-[#F6FF00]"
                  style={{ fontFamily: "'Monument Extended', sans-serif" }}
                >
                  {walletData.balance} ETH
                </p>
                <p className="text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ${walletData.usdBalance}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-white/20">
              <button
                className="w-full p-2 bg-transparent border-2 border-white/30 text-white hover:border-white/60 transition-colors flex items-center justify-center space-x-2"
                onMouseEnter={() => playSound("hover")}
                onClick={() => {
                  window.open(`https://etherscan.io/address/${walletData.address}`, "_blank")
                  playSound("click")
                }}
              >
                <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>VIEW ON EXPLORER</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                className={`
                  w-full p-2 transition-colors flex items-center justify-center
                  ${isDisconnectHovered
                    ? "bg-[#FF2D55] text-white"
                    : "bg-transparent border-2 border-[#FF2D55] text-[#FF2D55]"
                  }
                `}
                onMouseEnter={() => {
                  setIsDisconnectHovered(true)
                  playSound("hover")
                }}
                onMouseLeave={() => setIsDisconnectHovered(false)}
                onClick={handleDisconnect}
              >
                <span style={{ fontFamily: "'Monument Extended', sans-serif" }}>
                  {isDisconnectHovered ? "SURE?" : "DISCONNECT"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sheet */}
      {isMobile && connectionState === "connected" && (
        <WalletMobileSheet
          isOpen={isMobileSheetOpen}
          onClose={() => setIsMobileSheetOpen(false)}
          walletData={walletData}
          onDisconnect={handleDisconnect}
          onCopy={copyAddress}
          isCopied={isCopied}
        />
      )}
    </div>
  )
}
