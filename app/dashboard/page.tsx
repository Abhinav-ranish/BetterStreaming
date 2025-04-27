'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card'; // ✅ NO .tsx
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext'; // Import the custom hook

export default function DashboardPage() {
  const { user } = useUser(); // Get the user from the global UserContext
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p className="p-4">⏳ Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-4">👤 Welcome, {user?.email}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-xl transition">
          <CardContent>
            <h2 className="text-lg font-semibold">Browse Content</h2>
            <p className="text-sm text-gray-500 mb-2">Find available titles and start streaming</p>
            <Link
              href="/browse"
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Browse
            </Link>
          </CardContent>
        </Card>

        {user?.isAdmin && (
          <Card className="hover:shadow-xl transition">
            <CardContent>
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <p className="text-sm text-gray-500 mb-2">Add accounts, manage users and titles</p>
              <Link
                href="/admin"
                className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
              >
                Admin Controls
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
