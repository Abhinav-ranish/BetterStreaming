'use client';

import { useEffect, useState } from 'react';

type StreamOption = {
  title: string;
  infoHash: string;
  tag?: string;
};

type Subtitle = {
  id: number;
  language: string;
  label: string;
  url: string;
};

export default function WatchClient({ imdbId }: { imdbId: string }) {
  const [streams, setStreams] = useState<StreamOption[]>([]);
  const [selected, setSelected] = useState<StreamOption | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]); // ✅ fix added here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'waiting' | 'ready' | 'idle'>('idle');

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch(`/api/title/${imdbId}/stream`);
        const data = await res.json();
        console.log("🔍 Stream options:", data);

        if (!data.streams?.length) {
          setError('❌ No streams found: ' + JSON.stringify(data));
          return;
        }

        setStreams(data.streams);
        setSelected(data.streams[0]);
      } catch (err) {
        console.error('❌ Stream fetch error:', err);
        setError('❌ Failed to load streams');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [imdbId]);
  
  useEffect(() => {
    const ping = () => {
      fetch('http://localhost:4000/heartbeat', { method: 'POST' });
    };
  
    const interval = setInterval(ping, 30_000);
  
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const stop = () => {
      fetch('http://localhost:4000/stop', { method: 'POST' });
    };
  
    window.addEventListener('beforeunload', stop);
    return () => {
      stop();
      window.removeEventListener('beforeunload', stop);
    };
  }, []);  
  
  useEffect(() => {
    if (!selected) return;

    const magnet = `magnet:?xt=urn:btih:${selected.infoHash}&dn=${encodeURIComponent(selected.title || 'stream')}`;
    setStatus('waiting');
    setVideoUrl(null);
    setSubtitles([]); // reset on new stream

    const start = async () => {
      try {
        await fetch('http://localhost:4000/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ magnet }),
        });

        const poll = setInterval(async () => {
          const res = await fetch('http://localhost:4000/status');
          const json = await res.json();

          if (json.status === 'ready') {
            setVideoUrl(json.streamUrl);
            if (json.subtitles) setSubtitles(json.subtitles); // ✅ subtitle array from server
            setStatus('ready');
            clearInterval(poll);
          }
        }, 1000);
      } catch (err) {
        console.error('❌ Failed to start stream:', err);
        setError('❌ Could not start video stream');
      }
    };

    start();
  }, [selected]);

  return (
    <div className="p-6 text-white">
      {loading && <p>⏳ Loading streams...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {status === 'waiting' && <p className="text-yellow-400">📡 Waiting for stream to become available...</p>}

      {videoUrl && (
        <div className="relative w-full max-w-[1000px] mx-auto mb-4 bg-black rounded-lg">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-auto object-contain bg-black"
            >
          {subtitles.map((sub, idx) => (
            <track
              key={idx}
              src={`/api/subtitles?id=${idx}`}
              kind="subtitles"
              srcLang={sub.language.toLowerCase().slice(0, 2) || 'en'} // normalize
              label={sub.language}
              default={sub.language.toLowerCase().includes('en')} // ✅ only English default
            />
          ))}

          </video>
        </div>
      )}

      {streams.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Select Stream:</h2>
          <ul className="space-y-1">
            {streams.map((stream, idx) => (
              <li key={idx}>
                <button
                  className={`px-3 py-2 rounded text-left w-full border ${
                    stream.infoHash === selected?.infoHash
                      ? 'bg-blue-700'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelected(stream)}
                >
                  {stream.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}