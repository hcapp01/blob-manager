import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function DELETE(request: Request) {
  const { url } = await request.json()
  
  // Extract filename from URL
  const filename = decodeURIComponent(url.split('/').pop() || '')
  
  // Don't allow deletion if there's no filename or if it ends with '/'
  if (!filename || filename.endsWith('/')) {
    return NextResponse.json({ error: 'Cannot delete folders' }, { status: 400 })
  }

  try {
    await del(filename)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}