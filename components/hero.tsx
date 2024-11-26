'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTypewriter } from '@/hooks/useTypewriter'
import { Upload, Compass } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  const { displayText, isTypingComplete } = useTypewriter("Welcome to GAME.CFG!")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (isTypingComplete) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 530)

      return () => clearInterval(cursorInterval)
    }
  }, [isTypingComplete])

  const handleUploadCFG = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const configSection = document.getElementById('config-upload-section')
    if (configSection) {
      configSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center pt-20 pb-32 md:pt-32 md:pb-40 container mx-auto px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-orange-500 to-green-500 opacity-20 mt-24 mb-12 rounded-lg" />
      <div className="relative">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight min-h-[1.2em] relative">
            {displayText}
            <span className={`inline-block w-[0.05em] h-[1.2em] bg-white ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Fast, secure, and easy way to share your game configuration.
            Sign in to upload and manage your configs.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="default" size="lg" className="hover:bg-gray-100" onClick={handleUploadCFG}>
              <Upload className="w-5 h-5 mr-2" />
              Upload your CFG
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/explore">
                <Compass className="w-5 h-5 mr-2" />
                Explore public CFGs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

