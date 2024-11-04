import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function PUT(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const { url, content } = await request.json()
  const filename = url.split('/').pop()
  
  try {
    const blob = await put(filename, content, {
      access: 'public',
      contentType: 'text/plain',
      token
    })
    return NextResponse.json(blob)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to edit file' }, { status: 500 })
  }
}