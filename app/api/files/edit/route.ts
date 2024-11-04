import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function PUT(request: Request) {
  const { url, content } = await request.json()
  const filename = url.split('/').pop()
  
  const blob = await put(filename, content, {
    access: 'public',
    contentType: 'text/plain',
  })

  return NextResponse.json(blob)
}