"use client"

import { useRef, useEffect } from "react"

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to cover the entire document, not just the viewport
    const setCanvasSize = () => {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      )
      canvas.width = window.innerWidth
      canvas.height = documentHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Grid lines
    const gridLines: {
      x1: number
      y1: number
      x2: number
      y2: number
      alpha: number
      pulse: boolean
      pulseValue: number
    }[] = []

    // Create grid lines distributed throughout the entire height
    const createGridLines = () => {
      gridLines.length = 0

      // Horizontal lines - more of them to cover the entire page
      for (let i = 0; i < 15; i++) {
        const y = Math.random() * canvas.height
        gridLines.push({
          x1: 0,
          y1: y,
          x2: canvas.width,
          y2: y,
          alpha: 0.05 + Math.random() * 0.15,
          pulse: Math.random() > 0.7,
          pulseValue: 0,
        })
      }

      // Vertical lines
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width
        gridLines.push({
          x1: x,
          y1: 0,
          x2: x,
          y2: canvas.height,
          alpha: 0.05 + Math.random() * 0.15,
          pulse: Math.random() > 0.7,
          pulseValue: 0,
        })
      }
    }

    createGridLines()

    // Noise particles
    const noiseParticles: { x: number; y: number; size: number; alpha: number }[] = []

    // Create noise particles distributed throughout the entire height
    const createNoiseParticles = () => {
      noiseParticles.length = 0

      for (let i = 0; i < 300; i++) {
        noiseParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 1 + Math.random() * 3,
          alpha: 0.05 + Math.random() * 0.2,
        })
      }
    }

    createNoiseParticles()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      gridLines.forEach((line) => {
        if (line.pulse) {
          line.pulseValue += 0.01
          if (line.pulseValue > Math.PI * 2) {
            line.pulseValue = 0
          }
        }

        const alpha = line.pulse ? line.alpha + Math.sin(line.pulseValue) * 0.2 : line.alpha

        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = `rgba(246, 255, 0, ${alpha})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw noise particles
      noiseParticles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Recreate effects periodically
    const recreateInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        createGridLines()
      } else {
        createNoiseParticles()
      }
    }, 8000)

    // Check document height periodically and resize canvas if needed
    const resizeCheckInterval = setInterval(() => {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      )

      if (canvas.height < documentHeight) {
        canvas.height = documentHeight
        createGridLines()
        createNoiseParticles()
      }
    }, 2000)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      clearInterval(recreateInterval)
      clearInterval(resizeCheckInterval)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-70"
      style={{
        zIndex: 0,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  )
}
