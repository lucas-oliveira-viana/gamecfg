'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
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
      <Card className="mt-4 bg-black border-gray-700">
        <CardContent className="pt-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mt-4 bg-black border-gray-700">
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-4 bg-black border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Your CFGs</CardTitle>
      </CardHeader>
      <CardContent>
        {cfgs.length === 0 ? (
          <p className="text-gray-400">You haven't uploaded any CFGs yet.</p>
        ) : (
          <ul className="space-y-4">
            {cfgs.map((cfg) => (
              <li key={cfg.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-md">
                <div className="flex items-center space-x-4">
                  <Link href={`https://steamcommunity.com/profiles/${cfg.creator.steam_id}`} target="_blank" rel="noopener noreferrer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getAvatarUrl(cfg.creator.avatar)} alt={cfg.creator.username} />
                      <AvatarFallback>{cfg.creator.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link href={`https://steamcommunity.com/profiles/${cfg.creator.steam_id}`} target="_blank" rel="noopener noreferrer">
                      <h3 className="text-lg font-semibold text-white hover:underline">{cfg.creator.username}</h3>
                    </Link>
                    <p className="text-sm text-gray-400">{cfg.file_name}</p>
                    <p className="text-xs text-gray-500">Created: {new Date(cfg.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`privacy-${cfg.id}`} className="text-sm text-gray-300 flex items-center">
                      {cfg.is_public ? (
                        <Eye className="h-4 w-4 inline-block mr-1" />
                      ) : (
                        <EyeOff className="h-4 w-4 inline-block mr-1" />
                      )}
                      {cfg.is_public ? 'Public' : 'Private'}
                    </Label>
                    <Switch
                      id={`privacy-${cfg.id}`}
                      checked={cfg.is_public}
                      onCheckedChange={(isPublic) => handlePrivacyToggle(cfg.id, isPublic)}
                    />
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/config/${cfg.link_identifier}`}>View</Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(cfg.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

