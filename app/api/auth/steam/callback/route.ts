import { NextRequest, NextResponse } from 'next/server'
import SteamAuth from 'node-steam-openid'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/utils/jwt'

const steam = new SteamAuth({
  realm: process.env.NEXT_PUBLIC_APP_URL || '',
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/steam/callback`,
  apiKey: '49EFC285135A6F74640B5898E7B807FA'
})

export async function GET(request: NextRequest) {
  try {
    const steamUser = await steam.authenticate(request)
    
    if (steamUser && steamUser.steamid && steamUser.username) {
      let { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('steam_id', steamUser.steamid)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError)
        throw new Error('Database error while fetching user')
      }

      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            { 
              steam_id: steamUser.steamid, 
              username: steamUser.username,
              avatar: steamUser.avatar.small
            }
          ])
          .single()

        if (insertError) {
          console.error('Error creating new user:', insertError)
          throw new Error('Database error while creating new user')
        }

        existingUser = newUser
      }

      const token = generateToken({
        id: existingUser.id,
        steamid: existingUser.steam_id,
        username: existingUser.username,
        avatar: JSON.parse(existingUser.avatar)
      })

      const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL)
      redirectUrl.searchParams.append('token', token)
      
      return NextResponse.redirect(redirectUrl)
    } else {
      throw new Error('Invalid user data received from Steam')
    }
  } catch (error) {
    console.error('Steam authentication error:', error)
    
    const errorUrl = new URL('/login', process.env.NEXT_PUBLIC_APP_URL)
    errorUrl.searchParams.append('error', 'Authentication failed')
    
    return NextResponse.redirect(errorUrl)
  }
}

