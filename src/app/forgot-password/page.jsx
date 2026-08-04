'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // State baru untuk cek apakah email sudah terkirim
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true); // Ubah tampilan ke UI sukses
      } else {
        setErrorMsg(data.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 items-center justify-center p-4 sm:p-6 lg:p-8 ">
      <div className="w-full max-w-xl bg-white p-8 sm:p-12 md:p-16 rounded-md border border-gray-100 shadow-xs text-center transition-all">
        
        {/* ========================================================= */}
        {/* TAMPILAN 1: JIKA EMAIL SUDAH TERKIRIM (SUCCESS STATE)     */}
        {/* ========================================================= */}
        {isSubmitted ? (
          <div className="space-y-6">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✉️
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Check Your Email
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2">
              We've sent a password reset link to <strong className="text-gray-900">{email}</strong>. 
              Please check your inbox and click the link to reset your password.
            </p>

            {/* PETUNJUK MEMBUKA TAB BARU */}
            <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-left text-xs text-blue-900 leading-relaxed">
              💡 <strong>Note:</strong> Opening the link from your email will launch a new tab. You can safely close this browser tab now.
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                ← Back to Log In
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* TAMPILAN 2: FORM INPUT EMAIL (INITIAL STATE)              */
          /* ========================================================= */
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Forgotten your password?
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8 px-2 sm:px-4">
              There is nothing to worry about, we'll send you a message to help you reset your password.
            </p>

            {/* ERROR MESSAGE */}
            {errorMsg && (
              <div className="mb-6 text-xs text-red-600 font-medium bg-red-50 px-4 py-3 rounded-lg border border-red-200 text-left">
                {errorMsg}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter personal or work email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-xs mt-2 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>

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
          </>
        )}

      </div>
    </div>
  );
}