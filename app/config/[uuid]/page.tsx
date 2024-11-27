'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Download, Copy, Check } from 'lucide-react'
import { CS2KeyBindings } from '@/components/cs2-key-bindings'
import { CS2MouseBindings } from '@/components/cs2-mouse-bindings'
import { ConfigCategories } from '@/components/config-categories'
import FlickeringGrid from "@/components/ui/flickering-grid"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

type Config = {
  file_name: string
  content: string
}

type KeyBinding = {
  key: string
  command: string
}

type MouseBinding = {
  button: string
  command: string
}

export default function ConfigPage() {
  const params = useParams()
  const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [keyBindings, setKeyBindings] = useState<KeyBinding[]>([])
  const [mouseBindings, setMouseBindings] = useState<MouseBinding[]>([])
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const fetchConfig = useCallback(async () => {
    if (!uuid) {
      console.error('UUID is undefined')
      setError('Invalid configuration ID')
      setIsLoading(false)
      return
    }

    console.log('Fetching config for UUID:', uuid)
    setIsLoading(true)
    setError(null)
    setConfig(null)

    try {
      const response = await fetch(`/api/config?link_identifier=${encodeURIComponent(uuid)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Fetch response:', response.status, response.statusText)

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Fetched config data:', data)
      setConfig(data)
      parseBindings(data.content)
    } catch (err) {
      console.error('Error fetching config:', err)
      setError('Failed to load configuration. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [uuid])

  useEffect(() => {
    console.log('ConfigPage mounted, UUID:', uuid)
    fetchConfig()
  }, [fetchConfig])

  const parseBindings = (content: string) => {
    const bindRegex = /^bind\s+"(.+)"\s+"(.+)"$/gm
    const keyBindings: KeyBinding[] = []
    const mouseBindings: MouseBinding[] = []
    let match

    while ((match = bindRegex.exec(content)) !== null) {
      const [, key, command] = match
      if (key.toLowerCase().startsWith('mouse')) {
        mouseBindings.push({ button: key, command })
      } else {
        keyBindings.push({ key, command })
      }
    }

    setKeyBindings(keyBindings)
    setMouseBindings(mouseBindings)
    
    console.log('Parsed key bindings:', keyBindings)
    console.log('Parsed mouse bindings:', mouseBindings)
  }

  const handleTryAgain = () => {
    console.log('Trying again...')
    fetchConfig()
  }

  const handleDownload = () => {
    if (config) {
      const blob = new Blob([config.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = config.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleCopyContent = () => {
    if (config) {
      navigator.clipboard.writeText(config.content).then(() => {
        setIsCopied(true)
        toast({
          title: "Copied!",
          description: "Configuration content has been copied to clipboard.",
        })
        setTimeout(() => setIsCopied(false), 2000)
      }).catch((err) => {
        console.error('Failed to copy: ', err)
        toast({
          title: "Error",
          description: "Failed to copy configuration content.",
          variant: "destructive",
        })
      })
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="container mx-auto py-8">
          <div className="space-y-8">
            <Card className="w-full bg-background border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-8 w-64" />
                <div className="flex space-x-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[40vh] w-full" />
              </CardContent>
            </Card>

            <Card className="w-full bg-background border-0">
              <CardHeader>
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((index) => (
                    <Card key={index} className="bg-background border-0">
                      <CardHeader>
                        <Skeleton className="h-6 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-32 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full bg-background border-0">
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-8">
                  <Skeleton className="h-64 w-full md:w-[calc(50%-1rem)]" />
                  <Skeleton className="h-64 w-full md:w-[calc(50%-1rem)]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (error || !config) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <p className="text-xl mb-4">{error || 'Configuration not found.'}</p>
          <div className="flex space-x-4">
            <Button onClick={handleTryAgain}>Try Again</Button>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <Card className="w-full bg-background border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-white">
                Configuration: {config.file_name}
              </CardTitle>
              <div className="flex space-x-2">
                <Button onClick={handleCopyContent} className="flex items-center gap-2">
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? 'Copied' : 'Copy All'}
                </Button>
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download CFG
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={config.content}
                readOnly
                className="h-[40vh] bg-gray-900 text-white font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card className="w-full bg-background border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Configuration Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ConfigCategories content={config.content} />
            </CardContent>
          </Card>

          <Card className="w-full bg-background border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-white">CS2 Bindings Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-8">
                <CS2KeyBindings bindings={keyBindings} />
                <CS2MouseBindings bindings={mouseBindings} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <FlickeringGrid className="absolute inset-0 z-0" color="#6B7280" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col mt-16">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  )
}

