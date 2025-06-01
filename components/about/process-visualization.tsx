"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ProcessStep } from "@/components/about/process-step"

interface ProcessVisualizationProps {
  activeStep: number
}

export function ProcessVisualization({ activeStep }: ProcessVisualizationProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)

      if (sectionRef.current && pathRef.current) {
        // Animate the path based on scroll position
        const pathLength = pathRef.current.getTotalLength()
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        })
      }
    }
  }, [])

  // Process step data
  const steps = [
    {
      number: 1,
      title: "LIST YOUR TREASURE",
      description:
        "Cards undergo rigorous verification before being tokenized on our secure blockchain. Authentication is forever linked to your digital asset.",
      technicalCallout: "MULTI-FACTOR AUTHENTICATION",
      color: "#F6FF00", // Electric yellow
      visualComponent: (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-64 border-4 border-pikavault-yellow relative overflow-hidden">
              <div className="absolute inset-0 bg-pikavault-yellow/10"></div>
              <div className="absolute top-0 left-0 w-full h-2 bg-pikavault-yellow animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-pikavault-yellow animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-pikavault-yellow rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-pikavault-yellow/50 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 2,
      title: "SECURE TRANSACTION",
      description:
        "When a buyer purchases your card, payment is automatically secured in our smart contract escrow. Funds remain protected until successful delivery.",
      technicalCallout: "ESCROW SMART CONTRACT",
      color: "#00F5FF", // Digital teal
      visualComponent: (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-4 border-pikavault-cyan relative transform rotate-45">
              <div className="absolute inset-0 bg-pikavault-cyan/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-pikavault-cyan transform -rotate-45 flex items-center justify-center">
                <div className="w-16 h-16 bg-pikavault-cyan/30 animate-pulse"></div>
              </div>
              <div className="absolute top-0 left-0 w-6 h-6 bg-pikavault-cyan"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-pikavault-cyan"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 3,
      title: "TRACKABLE DELIVERY",
      description:
        "Seller attaches a unique QR code to the package containing cryptographic delivery verification. Each code contains tamper-proof delivery confirmation data.",
      technicalCallout: "CRYPTOGRAPHIC VERIFICATION",
      color: "#FF2D55", // Cyber pink
      visualComponent: (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-4 border-pikavault-pink relative">
              <div className="absolute inset-0 bg-pikavault-pink/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 grid grid-cols-4 grid-rows-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-pikavault-pink"
                    style={{
                      opacity: Math.random() > 0.5 ? 1 : 0.3,
                    }}
                  ></div>
                ))}
              </div>
              <div className="absolute top-0 left-0 w-full h-1 bg-pikavault-pink animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-pikavault-pink animate-pulse"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 4,
      title: "VERIFIED COMPLETION",
      description:
        "Buyer scans QR code upon receipt, confirming successful delivery. Smart contract automatically releases funds to seller, completing the secure P2P transaction.",
      technicalCallout: "INSTANT SETTLEMENT",
      color: "#00FF85", // Success green
      visualComponent: (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-[#00FF85] transform rotate-45 relative">
                <div className="absolute inset-0 bg-[#00FF85]/10"></div>
              </div>
              <div className="w-24 h-24 border-4 border-[#00FF85] transform rotate-45 absolute top-0 left-24">
                <div className="absolute inset-0 bg-[#00FF85]/10"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#00FF85]/30 animate-pulse"></div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section ref={sectionRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24 relative">
      <div className="container mx-auto relative z-10">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-24 text-center"
          style={{ fontFamily: "'Monument Extended', sans-serif" }}
        >
          THE <span className="text-pikavault-yellow">PROCESS</span>
        </h2>

        <div className="relative">
          {/* Process flow path */}
          <div className="absolute inset-0 hidden md:block">
            <svg width="100%" height="100%" viewBox="0 0 1000 1200" preserveAspectRatio="none">
              <path
                ref={pathRef}
                d="M200,100 C400,100 600,300 800,300 C900,300 900,500 800,500 C600,500 400,700 200,700 C100,700 100,900 200,900 C400,900 600,1100 800,1100"
                fill="none"
                stroke={activeStep >= 0 ? "#F6FF00" : "#333"}
                strokeWidth="4"
                strokeDasharray="0"
                strokeDashoffset="0"
                className="transition-colors duration-500"
              />
            </svg>
          </div>

          {/* Process steps */}
          <div className="relative z-10 space-y-64">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                technicalCallout={step.technicalCallout}
                color={step.color}
                visualComponent={step.visualComponent}
                isActive={activeStep >= index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
