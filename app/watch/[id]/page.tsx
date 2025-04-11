'use client';

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Link from 'next/link';

export default function WatchPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [streams, setStreams] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch(`/api/title/${params.id}/stream`);
        const data = await res.json();

        if (!data.streams || data.streams.length === 0) {
          setError('No streams available');
          setLoading(false);
          return;
        }

        setStreams(data.streams);
        setTitle(data.streams[selectedIndex]?.title || 'Streaming');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch stream info');
      } finally {
        setLoading(false);
      }
    };

    fetchStreams();
  }, [params.id, selectedIndex]);

  const handlePlay = async () => {
    const selected = streams[selectedIndex];
    const magnet = `magnet:?xt=urn:btih:${selected.infoHash}`;

    try {
      await invoke('start_stream', { magnet });
    } catch (err: any) {
      console.error('Failed to start stream:', err);
      alert('Failed to start VLC stream. Make sure webtorrent is installed.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">🎬 {title}</h1>
        <Link href="/browse" className="text-blue-600 hover:underline text-sm">
          ← Back to Browse
        </Link>
      </div>

      {loading && <p className="text-gray-500">⏳ Loading stream info...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {streams.length > 0 && (
        <>
          {streams.length > 1 && (
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Select Quality:</label>
              <select
                className="border p-2 rounded"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
              >
                {streams.map((s, idx) => (
                  <option key={idx} value={idx}>
                    {s.name?.replace(/\n/g, ' ')} ({s.title?.slice(0, 60)}...)
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handlePlay}
          >
            ▶️ Play in VLC
          </button>
        </>
      )}
    </div>
  );
}
