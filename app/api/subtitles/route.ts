// app/api/subtitles/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return new Response('Missing subtitle ID', { status: 400 });

  const subtitleRes = await fetch(`http://localhost:4000/subtitles?id=${id}`);
  const contentType = subtitleRes.headers.get('content-type') || 'text/vtt';

  return new Response(subtitleRes.body, {
    headers: { 'Content-Type': contentType }
  });
}
