'use client';

import { useState } from 'react';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'auth' | 'verify'>('auth');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Auth failed');
      }

      if (mode === 'register') {
        setStep('verify');
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'OTP failed');
      }

      // ✅ Automatically log in after verification
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        throw new Error('OTP verified, but auto-login failed');
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {mode === 'login' ? 'Login' : step === 'auth' ? 'Register' : 'Verify OTP'}
      </h1>

      {step === 'auth' && (
        <>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleAuth}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Next'}
          </button>
        </>
      )}

      {step === 'verify' && (
        <>
          <p className="text-sm mb-3 text-gray-600">Enter the OTP sent to your email.</p>
          <input
            type="text"
            placeholder="OTP"
            className="w-full mb-3 p-2 border rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerify}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </>
      )}

      {message && <p className="text-red-600 text-sm mt-4">{message}</p>}
    </div>
  );
}
