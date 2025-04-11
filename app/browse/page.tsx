// app/browse/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Title {
  id: string;
  name: string;
  imageUrl?: string;
  service: {
    name: string;
  };
}

const AnimatedCard = ({ title }: { title: Title }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white shadow-md rounded overflow-hidden"
  >
    <img
      src={title.imageUrl || 'https://via.placeholder.com/300x170'}
      alt={title.name}
      className="w-full h-[170px] object-cover"
    />
    <div className="p-2">
      <p className="font-semibold text-sm truncate">{title.name}</p>
      <span className="text-xs text-gray-500">{title.service.name}</span>
      <Link
        href={`/watch/${title.id}`}
        className="block mt-2 text-blue-600 hover:underline text-sm"
      >
        ▶ Play
      </Link>
    </div>
  </motion.div>
);

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 All Shows</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {titles.map((t) => (
          <AnimatedCard key={t.id} title={t} />
        ))}
      </div>
    </div>
  );
}
