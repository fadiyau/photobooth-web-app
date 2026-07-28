'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LoginRequiredModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    router.push('/login'); // Sesuaikan rute ke halaman login kamu
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      {/* Box Modal */}
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-xl border border-gray-100 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Tombol Close (X) di Pojok Kanan Atas */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Icon SVG Murni */}
        <div className="mb-4 flex justify-start items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 100 100" 
            className="w-12 h-12"
          >
            <circle cx="53" cy="53" r="45" fill="#B5B5B5" />
            <circle cx="47" cy="47" r="45" fill="#E0E0E0" />
            <g 
              stroke="#4A4A4A" 
              strokeWidth="5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
            >
              <path d="M 52 30 H 60 C 63 30 65 32 65 35 V 59 C 65 62 63 64 60 64 H 52" />
              <line x1="25" y1="47" x2="52" y2="47" />
              <polyline points="43,38 52,47 43,56" />
            </g>
          </svg>
        </div>

        {/* Judul & Deskripsi Keterangan */}
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          Log In to Continue
        </h3>
        <p className="text-sm font-medium text-gray-600 leading-relaxed mb-6">
          You have used your 3 free sessions. Please log in to continue.
        </p>

        {/* Grid Tombol Cancel & Log In */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tombol Cancel */}
          <button
            onClick={onClose}
            className="w-full bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-bold py-3 rounded-xl transition-all cursor-pointer text-sm active:scale-98"
          >
            Cancel
          </button>

          {/* Tombol Log In */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-xs active:scale-98"
          >
            Log in
          </button>
        </div>

      </div>
    </div>
  );
}