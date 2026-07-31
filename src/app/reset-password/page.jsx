'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password minimal harus 8 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Password berhasil diperbarui! Silakan login kembali.');
        router.push('/login');
      } else {
        setErrorMsg(data.message || 'Gagal memperbarui password. Token mungkin sudah kedaluwarsa.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-lg bg-white p-8 sm:p-12 rounded-2xl border border-gray-100 shadow-sm text-center transition-all">
        
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Create your new password
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
          Please enter your new password below to secure your account.
        </p>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100 text-left">
            {errorMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* INPUT NEW PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 leading-tight">
              It must be a combination of minimum 8 letters, numbers, and symbols.
            </p>
          </div>

          {/* INPUT CONFIRM PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 text-xs sm:text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-xs mt-4 cursor-pointer text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating Password...' : 'Create Password'}
          </button>

          {/* BACK TO LOG IN LINK */}
          <div className="text-center pt-3">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              ← Back to Log In
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}