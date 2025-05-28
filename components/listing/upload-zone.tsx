"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { Upload, Camera, X, Check, AlertTriangle } from "lucide-react"

interface UploadZoneProps {
  onImageUpload: (images: string[]) => void
  uploadedImages: string[]
  isProcessing: boolean
  onSound: (soundType: "hover" | "click" | "success" | "error") => void
}

export function UploadZone({ onImageUpload, uploadedImages, isProcessing, onSound }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [captureType, setCaptureType] = useState<"front" | "back" | "corner" | "holo">("front")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState("")
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Animation for drop zone
  useEffect(() => {
    if (dropZoneRef.current) {
      if (isDragging) {
        gsap.to(dropZoneRef.current, {
          borderWidth: 8,
          backgroundColor: "rgba(246, 255, 0, 0.1)",
          scale: 1.02,
          duration: 0.3,
        })
      } else {
        gsap.to(dropZoneRef.current, {
          borderWidth: 4,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          scale: 1,
          duration: 0.3,
        })
      }
    }
  }, [isDragging])

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    onSound("hover")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    onSound("click")

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  // Process uploaded files
  const handleFiles = (files: FileList) => {
    setUploadError("")
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    if (validFiles.length === 0) {
      setUploadError("Please upload valid image files (JPG, PNG, etc.)")
      onSound("error")
      return
    }

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          const imageUrls = validFiles.map((file) => URL.createObjectURL(file))
          onImageUpload([...uploadedImages, ...imageUrls])
          setUploadProgress(0)
          onSound("success")
        }, 500)
      }
    }, 200)
  }

  // Handle camera activation
  const activateCamera = async () => {
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream
        setCameraActive(true)
        onSound("click")
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setUploadError("Could not access camera. Please check permissions.")
      onSound("error")
    }
  }

  // Handle camera capture
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const imageUrl = URL.createObjectURL(blob)
              onImageUpload([...uploadedImages, imageUrl])
              onSound("success")

              // Move to next capture type
              if (captureType === "front") setCaptureType("back")
              else if (captureType === "back") setCaptureType("corner")
              else if (captureType === "corner") setCaptureType("holo")
              else {
                // Stop camera after all captures
                stopCamera()
              }
            }
          },
          "image/jpeg",
          0.95,
        )
      }
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
      setCaptureType("front")
    }
  }

  // Remove uploaded image
  const removeImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    onImageUpload(newImages)
    onSound("click")
  }

  return (
    <div className="space-y-8">
      {/* Main upload zone */}
      <div
        ref={dropZoneRef}
        className={`relative border-4 border-dashed ${
          isDragging ? "border-[#F6FF00]" : "border-white/30"
        } bg-white/5 p-8 h-80 flex flex-col items-center justify-center transition-colors duration-300`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !cameraActive && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
        />

        {!cameraActive ? (
          <>
            <Upload className="w-16 h-16 text-white/50 mb-4" />
            <p className="text-xl font-bold text-center mb-2" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
              DRAG & DROP IMAGES
            </p>
            <p className="text-white/70 text-center mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Upload high-quality images of your card (front, back, corners, holographic effect)
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                activateCamera()
              }}
              className="px-6 py-3 bg-[#00F5FF] text-[#0A0A0A] font-bold flex items-center space-x-2"
              style={{ fontFamily: "'Monument Extended', sans-serif" }}
              onMouseEnter={() => onSound("hover")}
            >
              <Camera className="w-5 h-5" />
              <span>USE CAMERA</span>
            </button>
          </>
        ) : (
          <div className="relative w-full h-full">
            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover"></video>

            {/* Camera overlay */}
            <div className="absolute inset-0 border-8 border-[#F6FF00] pointer-events-none"></div>

            {/* Capture type indicator */}
            <div
              className="absolute top-4 left-4 px-4 py-2 bg-[#0A0A0A]/80 border-2 border-[#F6FF00]"
              style={{ fontFamily: "'Monument Extended', sans-serif" }}
            >
              CAPTURE: {captureType.toUpperCase()}
            </div>

            {/* Camera controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button
                onClick={captureImage}
                className="px-6 py-3 bg-[#F6FF00] text-[#0A0A0A] font-bold"
                style={{ fontFamily: "'Monument Extended', sans-serif" }}
                onMouseEnter={() => onSound("hover")}
                onClick={() => onSound("click")}
              >
                CAPTURE
              </button>
              <button
                onClick={stopCamera}
                className="px-6 py-3 bg-[#FF2D55] text-white font-bold"
                style={{ fontFamily: "'Monument Extended', sans-serif" }}
                onMouseEnter={() => onSound("hover")}
                onClick={() => onSound("click")}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Upload progress */}
        {uploadProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-4 bg-white/10">
              <div
                className="h-full bg-[#FF2D55]"
                style={{ width: `${uploadProgress}%`, transition: "width 0.2s ease-out" }}
              ></div>
            </div>
          </div>
        )}

        {/* Error message */}
        {uploadError && (
          <div className="absolute bottom-4 left-4 right-4 bg-[#FF2D55]/20 border-l-4 border-[#FF2D55] p-4 flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#FF2D55] flex-shrink-0 mt-0.5" />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{uploadError}</p>
          </div>
        )}
      </div>

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
            UPLOADED IMAGES
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square overflow-hidden border-2 border-white/30 group-hover:border-white/70 transition-colors duration-300">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Card image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-[#0A0A0A]/70 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-[#FF2D55] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onMouseEnter={() => onSound("hover")}
                >
                  <X className="w-5 h-5" />
                </button>
                {isProcessing && index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A]/80 py-1 px-2">
                    <p className="text-xs text-[#00F5FF]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Analyzing card...
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isProcessing && (
            <div className="bg-[#0A0A0A] border-l-4 border-[#00F5FF] p-4">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 border-4 border-[#00F5FF] border-t-transparent rounded-full animate-spin"></div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  AI processing your card images. Detecting card details...
                </p>
              </div>
            </div>
          )}

          {!isProcessing && uploadedImages.length >= 2 && (
            <div className="bg-[#0A0A0A] border-l-4 border-[#00F5FF] p-4 flex items-start space-x-2">
              <Check className="w-5 h-5 text-[#00F5FF] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Card detected successfully!
                </p>
                <p className="text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  We've identified your card as "ELECTRIC SURGE" from the NEO THUNDER set.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload tips */}
      <div className="bg-white/5 p-6 border-l-4 border-white/30">
        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Monument Extended', sans-serif" }}>
          PHOTO TIPS
        </h3>
        <ul className="space-y-2 text-white/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <li className="flex items-start space-x-2">
            <span className="text-[#F6FF00] font-bold">•</span>
            <span>Use good lighting without glare or shadows</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#F6FF00] font-bold">•</span>
            <span>Capture front and back on a dark, solid background</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#F6FF00] font-bold">•</span>
            <span>Include close-ups of corners and edges to show condition</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#F6FF00] font-bold">•</span>
            <span>For holographic cards, capture at an angle to show the effect</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
