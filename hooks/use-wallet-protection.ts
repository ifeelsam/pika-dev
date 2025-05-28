"use client"

import { useState, useEffect } from "react"

export function useWalletProtection() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Check wallet connection status
    const checkWalletConnection = () => {
      const connected = localStorage.getItem("wallet_connected") === "true"
      setIsWalletConnected(connected)
    }

    checkWalletConnection()

    // Listen for storage changes (wallet connection in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wallet_connected") {
        checkWalletConnection()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const requireWalletConnection = () => {
    if (!isWalletConnected) {
      setShowToast(true)
      return false
    }
    return true
  }

  const handleWalletConnect = () => {
    setIsWalletConnected(true)
    setShowToast(false)
  }

  const handleToastClose = () => {
    setShowToast(false)
  }

  return {
    isWalletConnected,
    showToast,
    requireWalletConnection,
    handleWalletConnect,
    handleToastClose,
  }
}
