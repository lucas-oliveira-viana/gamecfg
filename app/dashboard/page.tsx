'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function Dashboard() {
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

  const handleSaveFile = () => {
    if (configInfo && fileName) {
      const blob = new Blob([configInfo], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="mt-20 bg-black border-gray-700">
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
                    Save File
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

