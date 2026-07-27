// components/DownloadModal.jsx
'use client';

import React from 'react';

export default function DownloadModal({ isOpen, onClose, selectedPhoto }) {
  if (!isOpen) return null;

  const handleDownload = (format) => {
    console.log(`Downloading photo ${selectedPhoto?.id} as ${format}`);
    onClose();
  };

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

        {/* Icon Download */}
        <div className="mb-4">
          <svg width="52" height="48" viewBox="0 0 52 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" width="48" height="48" rx="24" fill="#B7B7B7"/>
                <rect width="48" height="48" rx="24" fill="#D9D9D9"/>
                <path 
                    d="M15 25v2a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-2 M24 13v12 M19 20l5 5 5-5" 
                    stroke="black" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </svg>
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
          Choose Format
        </h3>
        <p className="text-xs text-gray-500 font-medium mt-1 mb-6">
          Choose a format to save your photo
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => handleDownload('PNG')}
            className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-xs tracking-wide hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-98"
          >
            PNG
          </button>

          <button 
            onClick={() => handleDownload('MP4')}
            className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-xs tracking-wide hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-98"
          >
            MP4 (Live Photo)
          </button>

          <button 
            onClick={() => handleDownload('GIF')}
            className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-xs tracking-wide hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-98"
          >
            GIF
          </button>
        </div>

      </div>
    </div>
  );
}