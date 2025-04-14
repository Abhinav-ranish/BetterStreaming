'use client';

import { useEffect, useState } from 'react';

export default function WatchClient({ imdbId }: { imdbId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndStream = async () => {
      try {
        const res = await fetch(`/api/title/${imdbId}/stream`);
        const data = await res.json();
        const best = data.streams?.[0];

        if (!best?.infoHash) {
          setError('❌ No valid stream found');
          return;
        }

        const magnet = `magnet:?xt=urn:btih:${best.infoHash}&dn=${encodeURIComponent(best.title || 'stream')}`;

        if ('__TAURI__' in window) {
          const { invoke } = await import('@tauri-apps/api/tauri');
          await invoke('start_stream_server', { magnet });
          setVideoUrl('http://localhost:4000/stream');
        } else {
          alert('❗ Please open this in the BetterStreaming desktop app.');
        }
      } catch (err) {
        console.error(err);
        setError('❌ Failed to stream video');
      } finally {
        setLoading(false);
      }
    };

    fetchAndStream();
  }, [imdbId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">🎬 Streaming</h1>
      {loading && <p>⏳ Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full rounded shadow-lg"
        />
      )}
    </div>
  );
}
