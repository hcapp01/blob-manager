import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 })
  }

  try {
    const { blobs } = await list({ token })
    return NextResponse.json({ files: blobs })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}