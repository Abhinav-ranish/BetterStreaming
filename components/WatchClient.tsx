'use client';

import { useEffect, useState } from 'react';
import { pickBestStream } from '@/utils/pickBestStream';

export default function WatchClient({ imdbId }: { imdbId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndPlay = async () => {
      try {
        const res = await fetch(`/api/title/${imdbId}/stream`);
        const data = await res.json();
        const best = pickBestStream(data.streams);

        if (!best) {
          setError('❌ No valid stream found');
          return;
        }

        const magnet = `magnet:?xt=urn:btih:${best.infoHash}&dn=${encodeURIComponent(best.name || 'stream')}`;
        console.log('🎯 Auto-selected stream:', best.title);

        if ('__TAURI__' in window) {
          const { invoke } = await import('@tauri-apps/api/tauri');
          await invoke('start_stream', { magnet });
        } else {
          alert('Open this in the BetterStreaming desktop app to start playback.');
        }
      } catch (e) {
        console.error(e);
        setError('❌ Failed to auto-play stream');
      } finally {
        setLoading(false);
      }
    };

    fetchAndPlay();
  }, [imdbId]);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">🎥 Now Playing</h1>
      {loading && <p>⏳ Fetching best stream...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <p className="text-green-600">✅ Stream started via Tauri desktop app</p>
      )}
    </div>
  );
}
