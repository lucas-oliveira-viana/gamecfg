'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Download } from 'lucide-react'

type Config = {
  file_name: string
  content: string
}

export default function ConfigPage() {
  const params = useParams()
  const uuid = Array.isArray(params.uuid) ? params.uuid[0] : params.uuid
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading configuration...</p>
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
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-black border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl text-white">
              Configuration: {config.file_name}
            </CardTitle>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download CFG
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={config.content}
              readOnly
              className="h-[60vh] bg-gray-900/50 text-white font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col mt-16">
        {renderContent()}
      </main>
      <Footer />
    </div>
  )
}

