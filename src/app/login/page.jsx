'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mencoba login dengan:", { username, password, rememberMe });
    alert("Login Berhasil! (Simulasi)");
    router.push('/'); 
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center p-6 md:p-12">
      
      {/* KONTEN UTAMA (Sama persis ukuran & posisinya dengan Sign Up) */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* ================= TOMBOL BACK ================= */}
        <div>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center p-2 -ml-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer group"
            aria-label="Go to Home"
          >
            <svg 
              className="w-6 h-6 text-gray-800 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
          </button>
        </div>

        {/* ================= GRID 2 KOLOM (Gambar & Form) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* KOLOM KIRI: PLACEHOLDER GAMBAR */}
          <div className="w-full aspect-square bg-slate-200/90 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" />
            </svg>
            
            <div className="w-1/2 h-1/2 bg-slate-100/80 border-2 border-slate-300/80 rounded-lg flex items-center justify-center z-10">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* KOLOM KANAN: FORM LOGIN */}
          <div className="w-full max-w-md mx-auto md:mx-0">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Log In
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Placeholder"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Placeholder"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg bg-gray-50/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400 text-gray-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 font-normal leading-normal">
                  It must be a combination of minimum 8 letters, numbers, and symbols.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  Remember me
                </label>
                
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all shadow-sm mt-2 cursor-pointer text-xs"
              >
                Log In
              </button>

              <p className="text-center text-xs font-medium text-gray-600 pt-2">
                No account yet?{' '}
                <Link href="/signup" className="text-blue-600 hover:underline font-bold">
                  Sign Up
                </Link>
              </p>

            </form>
          </div>

        </div>
      </div>

    </div>
  );
}