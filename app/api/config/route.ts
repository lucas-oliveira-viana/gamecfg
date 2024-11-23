import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const linkIdentifier = searchParams.get('link_identifier')
  console.log('GET request received for link_identifier:', linkIdentifier)
  return await fetchConfig(linkIdentifier)
}

export async function POST(request: NextRequest) {
  const { userId, cfgContent, fileName } = await request.json()
  console.log('POST request received for user:', userId)

  if (!userId || !cfgContent || !fileName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const linkIdentifier = crypto.randomUUID()
    const { data, error } = await supabase
      .from('configs')
      .insert({
        user_id: userId,
        game: 'CS2',
        content: cfgContent,
        file_name: fileName,
        link_identifier: linkIdentifier,
      })
      .select()

    if (error) throw error

    const insertedConfig = data[0]
    console.log('Config saved successfully:', insertedConfig.link_identifier)

    return NextResponse.json({ message: 'CFG saved successfully', cfgId: insertedConfig.link_identifier }, { status: 200 })
  } catch (error) {
    console.error('Error saving CFG:', error)
    return NextResponse.json({ error: 'Error saving CFG' }, { status: 500 })
  }
}

async function fetchConfig(linkIdentifier: string | null) {
  console.log('Fetching config for link_identifier:', linkIdentifier)

  if (!linkIdentifier) {
    return NextResponse.json({ error: 'Missing link_identifier parameter' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('configs')
      .select('content, file_name')
      .eq('link_identifier', linkIdentifier)
      .single()

    if (error) {
      console.error('Error fetching config:', error)
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }

    if (!data) {
      console.error('No data found for link_identifier:', linkIdentifier)
      return NextResponse.json({ error: 'Config not found' }, { status: 404 })
    }

    console.log('Config found:', data.file_name)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

