import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = await fetch(`${request.nextUrl.origin}/api/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(await request.json()),
  })

  return NextResponse.json(await response.json(), { status: response.status })
}

