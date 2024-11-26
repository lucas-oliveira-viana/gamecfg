'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

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
  id: number
  username: string
  steam_id: string
  avatar: string
}

type CFG = {
  id: number
  file_name: string
  link_identifier: string
  created_at: string
  is_public: boolean
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

export function CFGList({ userId }: { userId: number }) {
  const [cfgs, setCfgs] = useState<CFG[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCFGs = async () => {
      try {
        const response = await fetch(`/api/user-cfgs?userId=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch CFGs')
        }
        const data = await response.json()
        setCfgs(data)
      } catch (err) {
        setError('Failed to load CFGs. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCFGs()
  }, [userId])

  const handleDelete = async (cfgId: number) => {
    try {
      const response = await fetch(`/api/delete-cfg`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cfgId })
      })
      if (!response.ok) {
        throw new Error('Failed to delete CFG')
      }
      setCfgs(cfgs.filter(cfg => cfg.id !== cfgId))
      toast({
        title: "CFG Deleted",
        description: "Your CFG has been successfully deleted.",
      })
    } catch (err) {
      setError('Failed to delete CFG. Please try again.')
      toast({
        title: "Error",
        description: "Failed to delete CFG. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrivacyToggle = async (cfgId: number, isPublic: boolean) => {
    try {
      const response = await fetch('/api/update-cfg-privacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cfgId, isPublic })
      })
      if (!response.ok) {
        throw new Error('Failed to update CFG privacy')
      }
      setCfgs(cfgs.map(cfg => 
        cfg.id === cfgId ? { ...cfg, is_public: isPublic } : cfg
      ))
      toast({
        title: "Privacy Updated",
        description: `Your CFG is now ${isPublic ? 'public' : 'private'}.`,
      })
    } catch (err) {
      setError('Failed to update CFG privacy. Please try again.')
      toast({
        title: "Error",
        description: "Failed to update CFG privacy. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="mt-4 bg-background border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Your CFGs</CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((index) => (
            <div key={index} className="mb-4 p-4 border border-gray-700 rounded-md">
              <div className="flex items-center mb-2">
                <Skeleton className="h-6 w-6 rounded-full mr-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <div>
                  <Skeleton className="h-8 w-16 inline-block mr-2" />
                  <Skeleton className="h-8 w-8 inline-block" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mt-4 bg-background border-0">
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4 bg-background border-0">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Your CFGs</CardTitle>
      </CardHeader>
      <CardContent>
        {cfgs.length === 0 ? (
          <p className="text-gray-400">You haven't uploaded any CFGs yet.</p>
        ) : (
          <ul className="space-y-4">
            {cfgs.map((cfg) => (
              <li key={cfg.id} className="bg-background rounded-md overflow-hidden border border-gray-700">
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{cfg.file_name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={getAvatarUrl(cfg.creator.avatar)} alt={cfg.creator.username} />
                      <AvatarFallback>{cfg.creator.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-400">
                      Created by:{' '}
                      <Link 
                        href={`https://steamcommunity.com/profiles/${cfg.creator.steam_id}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {cfg.creator.username}
                      </Link>
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Created: {new Date(cfg.created_at).toLocaleDateString()}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`privacy-${cfg.id}`}
                        checked={cfg.is_public}
                        onCheckedChange={(isPublic) => handlePrivacyToggle(cfg.id, isPublic)}
                      />
                      <Label htmlFor={`privacy-${cfg.id}`} className="text-sm text-gray-300 flex items-center">
                        {cfg.is_public ? (
                          <Eye className="h-4 w-4 inline-block mr-1" />
                        ) : (
                          <EyeOff className="h-4 w-4 inline-block mr-1" />
                        )}
                        {cfg.is_public ? 'Public' : 'Private'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/config/${cfg.link_identifier}`}>View</Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(cfg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

