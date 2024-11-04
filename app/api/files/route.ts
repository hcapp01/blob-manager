import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const { blobs } = await list()
  return NextResponse.json({ files: blobs })
}