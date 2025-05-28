"use client"

import { useRef, useEffect } from "react"

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
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

    // Create grid lines
    const createGridLines = () => {
      gridLines.length = 0

      // Horizontal lines
      for (let i = 0; i < 5; i++) {
        const y = Math.random() * canvas.height
        gridLines.push({
          x1: 0,
          y1: y,
          x2: canvas.width,
          y2: y,
          alpha: 0.1 + Math.random() * 0.2,
          pulse: Math.random() > 0.7,
          pulseValue: 0,
        })
      }

      // Vertical lines
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width
        gridLines.push({
          x1: x,
          y1: 0,
          x2: x,
          y2: canvas.height,
          alpha: 0.1 + Math.random() * 0.2,
          pulse: Math.random() > 0.7,
          pulseValue: 0,
        })
      }
    }

    createGridLines()

    // Noise particles
    const noiseParticles: { x: number; y: number; size: number; alpha: number }[] = []

    // Create noise particles
    const createNoiseParticles = () => {
      noiseParticles.length = 0

      for (let i = 0; i < 100; i++) {
        noiseParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 1 + Math.random() * 3,
          alpha: 0.1 + Math.random() * 0.3,
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
          line.pulseValue += 0.02
          if (line.pulseValue > Math.PI * 2) {
            line.pulseValue = 0
          }
        }

        const alpha = line.pulse ? line.alpha + Math.sin(line.pulseValue) * 0.3 : line.alpha

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
    }, 5000)

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      clearInterval(recreateInterval)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}
