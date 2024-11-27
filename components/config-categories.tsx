'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type ConfigCategory = {
  name: string
  commands: string[]
  description: string
}

const CATEGORIES = {
  viewmodel: {
    patterns: ['viewmodel_', 'cl_righthand', 'cl_bob'],
    name: 'Viewmodel',
    description: 'Weapon view positioning and movement settings'
  },
  crosshair: {
    patterns: ['cl_crosshair', 'cl_fixed_crosshair'],
    name: 'Crosshair',
    description: 'Crosshair appearance and behavior'
  },
  hud: {
    patterns: ['hud_', 'cl_hud_', 'safezonex'],
    name: 'HUD',
    description: 'Heads-up display settings'
  },
  radar: {
    patterns: ['cl_radar_', 'cl_hud_radar_'],
    name: 'Radar',
    description: 'Radar display and scaling'
  },
  mouse: {
    patterns: ['sensitivity', 'm_', 'zoom_sensitivity_ratio'],
    name: 'Mouse',
    description: 'Mouse sensitivity and behavior'
  },
  sound: {
    patterns: ['volume', 'snd_', 'voice_'],
    name: 'Sound',
    description: 'Audio and voice settings'
  },
  network: {
    patterns: ['rate', 'cl_interp', 'cl_updaterate', 'cl_cmdrate'],
    name: 'Network',
    description: 'Network and interpolation settings'
  },
  video: {
    patterns: ['r_', 'mat_', 'fps_max'],
    name: 'Video',
    description: 'Graphics and performance settings'
  }
}

function categorizeCommands(content: string): ConfigCategory[] {
  const lines = content.split('\n')
  const categories: Record<string, string[]> = {}
  
  // Initialize categories
  Object.keys(CATEGORIES).forEach(key => {
    categories[key] = []
  })
  
  // Categorize each line
  lines.forEach(line => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith('//')) return
    
    let categorized = false
    for (const [category, info] of Object.entries(CATEGORIES)) {
      if (info.patterns.some(pattern => trimmedLine.toLowerCase().includes(pattern))) {
        categories[category].push(trimmedLine.endsWith(';') ? trimmedLine : `${trimmedLine};`)
        categorized = true
        break
      }
    }
    
    // Add to misc if not categorized
    if (!categorized && trimmedLine.includes(' ')) {
      if (!categories['misc']) categories['misc'] = []
      categories['misc'].push(trimmedLine.endsWith(';') ? trimmedLine : `${trimmedLine};`)
    }
  })
  
  // Convert to array and filter out empty categories
  return Object.entries(CATEGORIES)
    .map(([key, info]) => ({
      name: info.name,
      description: info.description,
      commands: categories[key]
    }))
    .filter(category => category.commands.length > 0)
}

interface ConfigCategoriesProps {
  content: string
}

export function ConfigCategories({ content }: ConfigCategoriesProps) {
  const categories = categorizeCommands(content)
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {categories.map((category) => (
        <Card key={category.name} className="bg-background border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              {category.name}
            </CardTitle>
            <p className="text-sm text-gray-400">{category.description}</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] rounded-md border border-gray-800">
              <div className="space-y-2 p-4">
                {category.commands.map((command, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm text-gray-300 break-all"
                  >
                    {command}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

