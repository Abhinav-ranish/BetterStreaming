'use client';

import { useEffect, useState } from 'react';  // Import useEffect along with useState
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext'; // Import the UserContext


export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();

  const { setUser, user } = useUser(); // Access setUser and user from UserContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // Redirect to dashboard if user already exists
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'register') {
        if (step === 1) {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setStep(2);
        } else {
          const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setUser(data.user); // Update the global user state
          router.push('/dashboard');
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUser(data.user); // Update the global user state
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 text-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Login' : 'Register'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-700 placeholder-gray-400 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {mode === 'register' && step === 2 ? (
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 mb-4 rounded bg-gray-700 placeholder-gray-400 text-white"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        ) : (
          <>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full p-3 mb-4 rounded bg-gray-700 placeholder-gray-400 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-sm text-gray-400"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded text-white font-semibold"
        >
          {mode === 'login'
            ? 'Login'
            : step === 1
            ? 'Register & Send OTP'
            : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
}
