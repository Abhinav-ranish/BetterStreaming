// app/api/episodes/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const imdbID = req.nextUrl.searchParams.get('imdbID');
  const season = req.nextUrl.searchParams.get('season');

  if (!imdbID || !season) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${imdbID}&Season=${season}`);
    const json = await res.json();

    if (json.Response === 'False') {
      return NextResponse.json({ error: json.Error }, { status: 404 });
    }

    return NextResponse.json({ episodes: json.Episodes || [], totalSeasons: json.totalSeasons });
  } catch (error) {
    console.error('❌ Failed to fetch episodes:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
