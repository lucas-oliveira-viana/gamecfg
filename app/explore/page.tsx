'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type AvatarData = {
  small: string
  medium: string
  large: string
  animated: {
    static: string
    movie: string
  }
  frame: {
    static: string | null
    movie: string | null
  }
}

type Creator = {
  id?: number
  username: string
  steam_id?: string
  avatar?: string
}

type PublicCFG = {
  id: number
  file_name: string
  link_identifier: string
  created_at: string
  creator: Creator
}

function getAvatarUrl(avatarJson: string | undefined): string | undefined {
  if (!avatarJson) return undefined
  try {
    const avatarData: AvatarData = JSON.parse(avatarJson)
    return avatarData.small
  } catch (error) {
    console.error('Error parsing avatar JSON:', error)
    return undefined
  }
}

export default function ExplorePage() {
  const [publicCFGs, setPublicCFGs] = useState<PublicCFG[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPublicCFGs = async () => {
      try {
        const response = await fetch('/api/public-cfgs')
        if (!response.ok) {
          throw new Error('Failed to fetch public CFGs')
        }
        const data = await response.json()
        setPublicCFGs(data)
      } catch (err) {
        setError('Failed to load public CFGs. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicCFGs()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 mt-20">Explore Public CFGs</h1>
        {isLoading ? (
          <Card className="mt-4 bg-black border-gray-700">
            <CardContent className="pt-6 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="mt-4 bg-black border-gray-700">
            <CardContent className="pt-6">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicCFGs.map((cfg) => (
              <Card key={cfg.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Link href={cfg.creator.steam_id ? `https://steamcommunity.com/profiles/${cfg.creator.steam_id}` : '#'} target="_blank" rel="noopener noreferrer">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getAvatarUrl(cfg.creator.avatar)} alt={cfg.creator.username} />
                        <AvatarFallback>{cfg.creator.username.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link href={cfg.creator.steam_id ? `https://steamcommunity.com/profiles/${cfg.creator.steam_id}` : '#'} target="_blank" rel="noopener noreferrer">
                        <CardTitle className="text-lg font-semibold hover:underline">{cfg.creator.username}</CardTitle>
                      </Link>
                      <p className="text-sm text-gray-400">{cfg.file_name}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">Created: {new Date(cfg.created_at).toLocaleDateString()}</p>
                  <Button asChild className="mt-4 w-full" variant="outline">
                    <Link href={`/config/${cfg.link_identifier}`}>View Config</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

