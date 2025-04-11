'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Title = {
  id: string;
  name: string;
  imageUrl?: string;
  service: {
    name: string;
  };
};

export default function BrowsePage() {
  const [titles, setTitles] = useState<Title[]>([]);

  useEffect(() => {
    const fetchTitles = async () => {
      const res = await fetch('/api/titles');
      const data = await res.json();
      setTitles(data.titles);
    };

    fetchTitles();
  }, []);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🎬 All Titles</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {titles.map((t) => (
          <div
            key={t.id}
            className="bg-neutral-900 rounded-lg overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <Link href={`/watch/${t.id}`}>
              <img
                src={t.imageUrl || 'https://via.placeholder.com/300x450'}
                alt={t.name}
                className="w-full h-[250px] object-contain bg-black cursor-pointer"
              />
            </Link>
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{t.name}</p>
              <p className="text-xs text-gray-400 mb-2">{t.service.name}</p>
              <Link
                href={`/watch/${t.id}`}
                className="text-blue-400 text-sm hover:underline"
              >
                ▶ Play
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
