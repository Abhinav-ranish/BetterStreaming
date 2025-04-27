// app/search/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query) return;
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results?.length) {
        setResults(data.results);
      } else {
        setError('No results found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong');
    }
  };

  const handleSelect = (imdbID: string) => {
    router.push(`/watch/${imdbID}`);
  };

  return (
    <div className="p-6 text-white min-h-screen bg-black">
      <h1 className="text-3xl font-bold mb-4">🔍 Search Titles</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie or show..."
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">❌ {error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((item) => (
          <div
            key={item.imdbID}
            onClick={() => handleSelect(item.imdbID)}
            className="cursor-pointer hover:scale-105 transition bg-neutral-900 rounded-lg overflow-hidden shadow"
          >
            <img
              src={item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/300x450'}
              alt={item.Title}
              className="w-full h-[300px] object-cover"
            />
            <div className="p-2">
              <h3 className="text-sm font-semibold truncate">{item.Title}</h3>
              <p className="text-xs text-gray-400">{item.Year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
