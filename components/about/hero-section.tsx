"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { motion } from "framer-motion"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sectionRef.current && headlineRef.current && subheadlineRef.current && underlineRef.current) {
      // Headline animation
      const chars = headlineRef.current.querySelectorAll(".char")
      gsap.set(chars, { opacity: 0, y: 100, rotateX: -90 })
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.03,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.5,
      })

      // Subheadline animation
      gsap.from(subheadlineRef.current, {
        opacity: 0,
        x: -50,
        duration: 1,
        delay: 1.2,
        ease: "power3.out",
      })

      // Underline animation
      gsap.to(underlineRef.current, {
        width: "100%",
        duration: 1.5,
        delay: 1.5,
        ease: "power3.inOut",
      })

      // Glitch effect for underline
      const glitchUnderline = () => {
        gsap.to(underlineRef.current, {
          x: "10px",
          opacity: 0.7,
          duration: 0.1,
          onComplete: () => {
            gsap.to(underlineRef.current, {
              x: "0px",
              opacity: 1,
              duration: 0.1,
            })
          },
        })
      }

      // Trigger glitch effect periodically
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          glitchUnderline()
        }
      }, 3000)

      return () => {
        clearInterval(glitchInterval)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-32 relative"
    >
      {/* Abstract geometric representation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F6FF00]/10 transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border-4 border-[#F6FF00]/20 transform -rotate-12"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-[#F6FF00]/5 transform rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 border-2 border-[#F6FF00]/15 transform rotate-45"></div>

        {/* Angular patterns */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,30 L80,100 L0,70 Z" fill="none" stroke="#F6FF00" strokeWidth="0.1" strokeOpacity="0.2" />
          <path d="M100,0 L0,40 L20,100 L100,60 Z" fill="none" stroke="#F6FF00" strokeWidth="0.1" strokeOpacity="0.2" />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-9xl font-black mb-8 leading-none tracking-tight"
          style={{ fontFamily: "'Monument Extended', sans-serif" }}
        >
          {/* Split text into characters for animation */}
          {"HOW PIKAVAULT       WORKS".split("").map((char, index) => (
            <span
              key={index}
              className={`char inline-block ${
                // Apply random transformations to some characters
                index % 5 === 0
                  ? "transform translate-y-2"
                  : index % 7 === 0
                    ? "transform -translate-y-2"
                    : index % 3 === 0
                      ? "transform translate-x-1"
                      : ""
              }`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <div className="relative mb-16">
          <p
            ref={subheadlineRef}
            className="text-xl md:text-3xl font-bold tracking-widest ml-24 md:ml-48"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SECURE - VERIFIED - GUARANTEED
          </p>
          <div ref={underlineRef} className="absolute bottom-0 left-24 md:left-48 h-1 bg-[#F6FF00] w-0"></div>
        </div>

        <motion.div
          className="mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <p className="text-xl text-white/70 leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            PikaVault revolutionizes the trading card market by connecting physical assets to digital ownership through
            blockchain technology. Our platform ensures authenticity, security, and trust in every transaction.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[#F6FF00] animate-bounce mb-2">↓</span>
        <p className="text-sm opacity-60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          SCROLL TO EXPLORE
        </p>
      </div>
    </section>
  )
}
