import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'
import crypto from 'crypto'
import { verifyToken } from '@/utils/jwt'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const linkIdentifier = searchParams.get('link_identifier')
  return await fetchConfig(linkIdentifier)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { link_identifier, userId, cfgContent, fileName } = body

  if (link_identifier) {
    return await fetchConfig(link_identifier)
  }

  if (!cfgContent || !fileName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let authenticatedUserId = null
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (decoded && decoded.payload) {
      authenticatedUserId = decoded.payload.id
    }
  }

  // Use authenticated user ID if available, otherwise use the provided userId (which might be null)
  const finalUserId = authenticatedUserId || userId

  try {
    const newLinkIdentifier = crypto.randomUUID()
    const { data, error } = await supabase
      .from('configs')
      .insert({
        user_id: finalUserId,
        game: 'CS2',
        content: cfgContent,
        file_name: fileName,
        link_identifier: newLinkIdentifier,
        is_public: finalUserId === null, // Set public if no user is associated
      })
      .select()

    if (error) throw error

    const insertedConfig = data[0]

    return NextResponse.json({ message: 'CFG saved successfully', cfgId: insertedConfig.link_identifier }, { status: 200 })
  } catch (error) {
    console.error('Error saving CFG:', error)
    return NextResponse.json({ error: 'Error saving CFG' }, { status: 500 })
  }
}

async function fetchConfig(linkIdentifier: string | null) {
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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

