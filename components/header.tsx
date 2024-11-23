'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings } from 'lucide-react'

type User = {
  steamid: string;
  username: string;
  avatar?: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if we're on the dashboard and have user info in the URL
    if (pathname === '/dashboard') {
      const params = new URLSearchParams(window.location.search)
      const steamid = params.get('steamid')
      const username = params.get('username')
      if (steamid && username) {
        setUser({ steamid, username })
        // Remove the query parameters from the URL
        window.history.replaceState({}, document.title, "/dashboard")
      }
    }
  }, [pathname])

  const handleSteamLogin = () => {
    window.location.href = '/api/auth/steam'
  }

  const handleLogout = () => {
    setUser(null)
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            GAME.CFG
          </Link>
          
          {!user ? (
            <Button onClick={handleSteamLogin} className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black">
              <Image 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/steam-icon-Qdmya1DG25syk2fFWNZwdTWcNFkFeZ.png"
                alt="Steam logo"
                width={32}
                height={21}
              />
              SIGN IN WITH STEAM
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-transparent transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-white">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

