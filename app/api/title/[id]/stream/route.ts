import { NextRequest, NextResponse } from 'next/server';
import { fetchFromStremio } from '@/lib/stremio'; // ✅ Use alias for internal routes

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const imdbId = params.id;

  try {
    const streamData = await fetchFromStremio(`/stream/movie/${imdbId}.json`);

    if (!Array.isArray(streamData) || streamData.length === 0) {
      return NextResponse.json({ error: 'No streams found' }, { status: 404 });
    }

    return NextResponse.json({ streams: streamData });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch stream info' },
      { status: 500 }
    );
  }
}
