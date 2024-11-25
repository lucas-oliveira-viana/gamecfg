'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Clipboard } from 'lucide-react'
import Image from 'next/image'
import { useUser } from '@/hooks/useUser'

export function ConfigUploaderHome() {
  const { user } = useUser()
  const [configInfo, setConfigInfo] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [configLink, setConfigLink] = useState<string | null>(null)
  const [showLink, setShowLink] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = async (e) => {
        const content = e.target?.result as string
        setConfigInfo(content)
        try {
          const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              userId: user ? user.id : null,
              cfgContent: content,
              fileName: file.name,
            }),
          })
          if (!response.ok) {
            throw new Error('Failed to save CFG')
          }
          const { cfgId } = await response.json()
          const link = `${window.location.origin}/config/${cfgId}`
          setConfigLink(link)
          setShowLink(true)
        } catch (error) {
          console.error('Error saving CFG:', error)
          alert('Failed to save CFG. Please try again.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleReset = () => {
    setConfigInfo(null)
    setFileName(null)
    setConfigLink(null)
    setShowLink(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCopyLink = () => {
    if (configLink) {
      navigator.clipboard.writeText(configLink).then(() => {
        setTooltipOpen(true)
        setTimeout(() => setTooltipOpen(false), 2000)
      })
    }
  }

  const handleSteamLogin = () => {
    if (configLink) {
      localStorage.setItem('pendingConfigLink', configLink)
    }
    window.location.href = '/api/auth/steam'
  }

  useEffect(() => {
    const linkConfig = async () => {
      const pendingConfigLink = localStorage.getItem('pendingConfigLink')
      if (user && pendingConfigLink) {
        try {
          const response = await fetch('/api/link-config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              configLink: pendingConfigLink,
              userId: user.id
            })
          })
          if (response.ok) {
            localStorage.removeItem('pendingConfigLink')
            router.push('/dashboard')
          } else {
            console.error('Failed to link config')
          }
        } catch (error) {
          console.error('Error linking config:', error)
        }
      }
    }
    linkConfig()
  }, [user, router])

  return (
    <Card className="mt-8 bg-black border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          {configInfo ? 'Your Game Config' : 'Upload Your Game Config'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!configInfo ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".cfg"
                onChange={handleFileUpload}
                className="hidden"
                id="config-upload-home"
                ref={fileInputRef}
              />
              <Button variant="secondary" className="mx-auto" onClick={handleButtonClick}>
                {fileName ? fileName : 'Select CFG File'}
              </Button>
              <p className="mt-2 text-sm text-gray-400">
                or drag and drop your config file here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">{fileName}</h3>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Upload Another
              </Button>
            </div>
            <Textarea 
              value={configInfo} 
              readOnly 
              className="h-64 bg-gray-900/50 text-white font-mono text-sm"
            />
            <div className="space-y-4">
              {configLink && (
                <TooltipProvider>
                  <Tooltip open={tooltipOpen}>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Your game config has been saved and is available at the link below:</p>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={configLink} 
                            readOnly 
                            className="bg-gray-900/50 text-white flex-grow"
                          />
                          <Button variant="outline" size="icon" onClick={handleCopyLink}>
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Link copied to clipboard!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {!user && (
                <Button onClick={handleSteamLogin} className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-black">
                  <Image 
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/steam-icon-Qdmya1DG25syk2fFWNZwdTWcNFkFeZ.png"
                    alt="Steam logo"
                    width={24}
                    height={24}
                  />
                  <span>Sign in with Steam to save config permanently</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

