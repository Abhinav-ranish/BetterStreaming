'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext'; // Import the custom hook

export default function Navbar() {
  const { user, setUser } = useUser(); // Access user state from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null); // Clear user from global state
    window.location.href = '/login'; // Redirect to login page
  };
  // Example of setting user after login


  return (
    <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* Left links */}
      <div className="flex gap-6">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/browse">Explore</Link>
        <Link href="/search" className="ml-auto">Browse</Link>
      </div>

      {/* Right auth */}
      <div className="flex gap-6 items-center">
        {user ? (
          <>
            <div className="flex relative gap-2">
              {/* User Avatar or Icon */}
              <span className="text-sm">{user.email}</span>
              <User size={18} onClick={handleDropdownToggle} className="cursor-pointer" />

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded-lg shadow-lg p-2">
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-700">
                    View Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
