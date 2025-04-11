'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, titles: 0, accounts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.isAdmin) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };

    fetchStats();
  }, [router]);

  const refreshTitles = async () => {
    await fetch('/api/admin/fetch-piratebay');
    alert('✅ Titles refreshed from PirateBay');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          <p>👤 Users: <strong>{stats.users}</strong></p>
          <p>🎬 Titles: <strong>{stats.titles}</strong></p>
          <p>🔑 Streaming Accounts: <strong>{stats.accounts}</strong></p>

          <button
            onClick={refreshTitles}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            🔄 Refresh Titles from PirateBay+
          </button>
        </div>
      )}
    </div>
  );
}
