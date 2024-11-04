import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  const { filename, content } = await request.json()
  
  try {
    const blob = await put(filename, content, {
      access: 'public',
      contentType: 'text/plain',
      token
    })
    return NextResponse.json(blob)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 })
  }
}