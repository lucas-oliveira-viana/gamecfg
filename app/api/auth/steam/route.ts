import { NextResponse } from 'next/server'
import SteamAuth from 'node-steam-openid'

const steam = new SteamAuth({
  realm: process.env.NEXT_PUBLIC_APP_URL || '', // your domain
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/steam/callback`, // URL that will handle the response from Steam
  apiKey: '49EFC285135A6F74640B5898E7B807FA' // Your Steam API key
})

export async function GET() {
  const redirectUrl = await steam.getRedirectUrl()
  return NextResponse.redirect(redirectUrl)
}

