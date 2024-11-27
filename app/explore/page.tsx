'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, SortAsc, SortDesc } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

type SortOrder = 'newest' | 'oldest'

export default function ExplorePage() {
  const [publicCFGs, setPublicCFGs] = useState<PublicCFG[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

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

  const sortedCFGs = [...publicCFGs].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  const handleSortChange = (value: string) => {
    setSortOrder(value as SortOrder)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 mt-20">
          <h1 className="text-3xl font-bold">Explore Public CFGs</h1>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-order" className="text-sm font-medium">
              Sort by:
            </label>
            <Select onValueChange={handleSortChange} defaultValue={sortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center">
                    <SortDesc className="mr-2 h-4 w-4" />
                    Newest first
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center">
                    <SortAsc className="mr-2 h-4 w-4" />
                    Oldest first
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
            {sortedCFGs.map((cfg) => (
              <Card key={cfg.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">{cfg.file_name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={getAvatarUrl(cfg.creator.avatar)} alt={cfg.creator.username} />
                      <AvatarFallback>{cfg.creator.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-400">
                      Created by:{' '}
                      <Link 
                        href={cfg.creator.steam_id ? `https://steamcommunity.com/profiles/${cfg.creator.steam_id}` : '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {cfg.creator.username}
                      </Link>
                    </p>
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

