'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mengirim link reset password ke:", email);
    alert(`Link reset password telah dikirim ke ${email}! (Simulasi)`);
    router.push('/login');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F3F4F6] items-center justify-center p-4 sm:p-6 lg:p-8 pt-20 ">
      <div className="w-full max-w-xl bg-white p-8 sm:p-12 md:p-16 rounded-md border border-gray-100 shadow-xs text-center transition-all">
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Forgotten your password?
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8 px-2 sm:px-4">
          There is nothing to worry about, we'll send you a message to help you reset your password.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          
          {/* INPUT EMAIL */}
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

          {/* TOMBOL KIRIM */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-xs mt-2 cursor-pointer text-xs sm:text-sm"
          >
            Send Reset Link
          </button>

          {/* TOMBOL KEMBALI KE LOGIN */}
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