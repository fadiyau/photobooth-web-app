'use client';

import React from 'react';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
        
        {/* Tombol Close (X) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* LOGO TRASH / DELETE (Double Layer Circle dengan SVG baru) */}
        <div className="mb-4 relative w-[52px] h-[48px]">
          <svg width="52" height="48" viewBox="0 0 52 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Layer Bayangan Belakang */}
            <rect x="4" width="48" height="48" rx="24" fill="#B7B7B7"/>
            {/* Layer Utuh Depan */}
            <rect width="48" height="48" rx="24" fill="#D9D9D9"/>
            
            {/* Icon Tempat Sampah Baru */}
            <g transform="translate(12, 12)">
              {/* Pegangan Tutup (Top handle) */}
              <path 
                d="M8 5H16V3C16 2.44772 15.5523 2 15 2H9C8.44772 2 8 2.44772 8 3V5Z" 
                stroke="#4A4A4A" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Tutup Tempat Sampah (Lid) */}
              <path 
                d="M3 5H21" 
                stroke="#4A4A4A" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />
              {/* Badan Tempat Sampah (Body) */}
              <path 
                d="M5 5L6.2 19.2C6.31 20.21 7.16 21 8.18 21H15.82C16.84 21 17.69 20.21 17.8 19.2L19 5" 
                stroke="#4A4A4A" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Garis-garis Vertikal (Lines) */}
              <path 
                d="M9 9V17M12 9V17M15 9V17" 
                stroke="#4A4A4A" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
          Delete Photo
        </h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed mt-2 mb-6">
          Are you sure you want to delete this photo? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-xs tracking-wider uppercase hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            CANCEL
          </button>

          <button 
            type="button"
            onClick={onConfirm}
            className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-xs tracking-wider uppercase hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            DELETE
          </button>
        </div>

      </div>
    </div>
  );
}