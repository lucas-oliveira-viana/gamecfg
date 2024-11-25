'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export function ConfigUploader() {
  const [configInfo, setConfigInfo] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
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
    <Card className="max-w-2xl mx-auto bg-black/50 border border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          {configInfo ? 'Your CS2 Config' : 'Upload Your CS2 Config'}
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
              <Button variant="default" className="mx-auto" onClick={handleButtonClick}>
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
              <Button variant="default" onClick={handleSaveFile}>
                Save File
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

