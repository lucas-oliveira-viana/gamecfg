import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token)

  if (!decoded || !decoded.payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { userId, cfgContent, fileName } = await request.json()

  if (userId !== decoded.payload.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('configs')
      .insert({
        user_id: userId,
        game: 'CS2',
        content: cfgContent,
        file_name: fileName,
      })
      .select()

    if (error) throw error

    const insertedConfig = data[0]
    const cfgLink = `${process.env.NEXT_PUBLIC_APP_URL}/config/${insertedConfig.link_identifier}`

    return NextResponse.json({ message: 'CFG saved successfully', cfgLink }, { status: 200 })
  } catch (error) {
    console.error('Error saving CFG:', error)
    return NextResponse.json({ error: 'Error saving CFG' }, { status: 500 })
  }
}

