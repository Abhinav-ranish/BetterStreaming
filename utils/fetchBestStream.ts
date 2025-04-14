// utils/fetchBestStream.ts

import { pickBestStream } from '@/utils/pickBestStream';

export async function fetchBestStream(imdbId: string) {
  try {
    const res = await fetch(`/api/title/${imdbId}/stream`);
    const data = await res.json();

    if (!Array.isArray(data.streams)) {
      console.warn('❌ Invalid streams response:', data);
      return null;
    }

    return pickBestStream(data.streams);
  } catch (err) {
    console.error('❌ Error fetching streams:', err);
    return null;
  }
}
