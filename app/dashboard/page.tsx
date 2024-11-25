'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@/hooks/useUser'
import { CFGList } from '@/components/cfg-list'

export default function Dashboard() {
  const { user } = useUser()
  const [configInfo, setConfigInfo] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target.result as string
        setConfigInfo(content)
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSaveFile = async () => {
    if (configInfo && fileName && user) {
      try {
        const response = await fetch('/api/save-cfg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: user.id,
            cfgContent: configInfo,
            fileName: fileName
          })
        })

        if (!response.ok) {
          throw new Error('Failed to save config')
        }

        const data = await response.json()
        alert(`Config saved successfully! Link: ${data.cfgLink}`)
        handleReset()
      } catch (error) {
        console.error('Error saving config:', error)
        alert('Failed to save config. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {user ? (
          <>
            <h1 className="text-3xl font-bold mb-6 mt-20">Welcome, {user.username}!</h1>
            <CFGList userId={user.id} />
            <Card className="mt-8 bg-black border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  Upload New CFG
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
                        id="config-upload"
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
                    <div className="flex justify-end space-x-4">
                      <Button variant="secondary" onClick={handleSaveFile}>
                        Save Config
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h2>
            <Button onClick={() => window.location.href = '/api/auth/steam'}>
              Sign in with Steam
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

