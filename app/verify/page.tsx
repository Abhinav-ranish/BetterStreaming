'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    const email = localStorage.getItem('email');
    if (!email) {
      alert('Missing email. Please register again.');
      router.push('/register');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert(data.error || 'Invalid OTP');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        className="border p-2 w-full mb-4"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />
      <button
        onClick={handleVerify}
        className="bg-black text-white px-4 py-2"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  );
}
