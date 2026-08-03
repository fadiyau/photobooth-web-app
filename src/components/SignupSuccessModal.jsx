'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

export default function SignupSuccessModal({ isOpen, onClose, onLoginClick }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Tombol Close (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon Checkmark Circle */}
        <div className="flex items-center justify-center w-14 h-12 mb-5">
            <svg xmlns="http://w3.org" viewBox="0 0 52 48" width="52" height="48" fill="none">
                {/* Efek Bayangan / 3D Belakang (Abu-abu Tua) */}
                <circle cx="28" cy="24" r="21" fill="#B7B7B7"/>
                
                {/* Lingkaran Utama Depan (Abu-abu Muda) */}
                <circle cx="24" cy="24" r="21" fill="#D9D9D9"/>
                
                {/* Lingkaran Hitam di Tengah */}
                <circle cx="24" cy="24" r="11" fill="#000000"/>
                
                {/* Simbol Centang Putih */}
                <path 
                d="M19.5 23.5 L22.5 26.5 L28.5 20.5" 
                stroke="#FFFFFF" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                />
            </svg>
        </div>
        {/* Title & Text */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Sign Up Successful
        </h2>
        <p className="text-sm text-gray-600 mb-8 font-medium">
          Please log in using your newly created account.
        </p>

        {/* Tombol Log In */}
        <button
          onClick={onLoginClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors text-sm cursor-pointer shadow-sm"
        >
          Log in
        </button>

      </div>
    </div>
  );
}