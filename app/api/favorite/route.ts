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

  const { cfgId, action } = await request.json()

  if (!cfgId || !['add', 'remove'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    if (action === 'add') {
      const { error } = await supabase
        .from('cfg_favorites')
        .insert({ user_id: decoded.payload.id, cfg_id: cfgId })

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('cfg_favorites')
        .delete()
        .match({ user_id: decoded.payload.id, cfg_id: cfgId })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating favorite:', error)
    return NextResponse.json({ error: 'Error updating favorite' }, { status: 500 })
  }
}

