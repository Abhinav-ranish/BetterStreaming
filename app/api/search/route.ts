// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const apiKey = process.env.OMDB_API_KEY;
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    console.log(url);
    const res = await fetch(url);
    const json = await res.json();
    console.log(json.json);

    if (json.Response === 'False') {
      console.warn('❌ OMDB returned nothing:', json.Error);
      return NextResponse.json({ results: [] });
    }

    return NextResponse.json({ results: json.Search || [] });
  } catch (error) {
    console.error('❌ OMDB fetch error:', error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
