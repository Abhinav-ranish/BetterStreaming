// app/api/title/[id]/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromStremio } from '@/lib/stremio';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const imdbId = pathParts[pathParts.length - 2]; // gets the [id] part

  try {
    const streamData = await fetchFromStremio(`/stream/movie/${imdbId}.json`);
    return NextResponse.json({ streams: streamData.streams || [] });    
  } catch (error) {
    console.error('❌ Stream fetch error:', error);
    return NextResponse.json({ streams: [] }, { status: 404 });
  }
}
