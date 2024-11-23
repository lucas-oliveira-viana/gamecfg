'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download } from 'lucide-react'

type Config = {
  file_name: string
  content: string
}

export default function ConfigPage() {
  const { uuid } = useParams()
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    if (!uuid) return

    setIsLoading(true)
    setError(null)
    setConfig(null)

    try {
      const response = await fetch(`/api/config?link_identifier=${encodeURIComponent(uuid as string)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch config')
      }

      const data = await response.json()
      setConfig(data)
    } catch (err) {
      console.error('Error fetching config:', err)
      setError('Failed to load configuration. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [uuid])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const handleTryAgain = () => {
    fetchConfig()
  }

  const handleDownload = () => {
    if (config) {
      const blob = new Blob([config.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = config.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading configuration...</p>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-black border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-white">
            Configuration: {config.file_name}
          </CardTitle>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download .cfg
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

