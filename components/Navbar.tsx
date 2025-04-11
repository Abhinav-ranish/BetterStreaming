'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="bg-black text-white px-6 py-4 flex gap-6">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/browse">Browse</Link>
      <Link href="/login">Login</Link>
    </div>
  );
}
