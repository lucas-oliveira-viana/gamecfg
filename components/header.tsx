'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Settings, User, Menu } from 'lucide-react'
import { useUser } from '@/hooks/useUser'

export function Header() {
  const { user, login, logout } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/dashboard') {
      const params = new URLSearchParams(window.location.search)
      const token = params.get('token')
      if (token) {
        login(token)
        window.history.replaceState({}, document.title, "/dashboard")
      }
    }
  }, [pathname, login])

  const handleSteamLogin = () => {
    window.location.href = '/api/auth/steam'
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const NavItems = () => (
    <>
      <li>
        <Link href="/explore" className="text-white hover:text-gray-300 transition-colors">
          Explore
        </Link>
      </li>
      {user && (
        <li>
          <Link
            href="/dashboard"
            className="text-white hover:text-gray-300 transition-colors"
          >
            My Profile
          </Link>
        </li>
      )}
    </>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              GAME.CFG
            </Link>
            <nav className="hidden md:block">
              <ul className="flex space-x-6 list-none p-0 m-0">
                <NavItems />
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {!user ? (
              <Button onClick={handleSteamLogin} className="hidden md:flex items-center gap-2 bg-white hover:bg-gray-100 text-black">
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
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2 hover:bg-transparent transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar?.small} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-white">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gray-900">
                <nav className="flex flex-col space-y-4 mt-8">
                  <ul className="flex flex-col space-y-4 list-none p-0 m-0">
                    <NavItems />
                  </ul>
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
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar?.small} alt={user.username} />
                          <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-white">{user.username}</span>
                      </div>
                      <Button onClick={handleLogout} variant="outline" className="w-full">
                        Log out
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

