import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  const { filename, content } = await request.json()
  
  const blob = await put(filename, content, {
    access: 'public',
    contentType: 'text/plain',
  })

  return NextResponse.json(blob)
}