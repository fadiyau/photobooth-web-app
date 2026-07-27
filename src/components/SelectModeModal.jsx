'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SelectModeModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelectLocal = () => {
    onClose();
    router.push('/local-mode');
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

        {/* Icon Header */}
        <div className="mb-4 flex justify-start items-center">
          <svg width="52" height="48" viewBox="0 0 52 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" width="48" height="48" rx="24" fill="#B7B7B7" />
            <rect width="48" height="48" rx="24" fill="#D9D9D9" />
            <path fillRule="evenodd" clipRule="evenodd" d="M19.2779 15.0732C19.7091 14.5705 20.3376 14.2188 21.0742 14.2188H25.9258C26.6624 14.2188 27.2909 14.5705 27.7221 15.0732C27.7487 15.1041 27.7729 15.1369 27.7947 15.1713L29.1613 17.3306C29.3334 17.513 29.5305 17.5938 29.6699 17.5938H32.7812C33.4526 17.5938 34.0964 17.8604 34.5711 18.3351C35.0458 18.8098 35.3125 19.4537 35.3125 20.125V30.25C35.3125 30.9213 35.0458 31.5652 34.5711 32.0399C34.0964 32.5146 33.4526 32.7812 32.7812 32.7812H14.2188C13.5474 32.7812 12.9036 32.5146 12.4289 32.0399C11.9542 31.5652 11.6875 30.9213 11.6875 30.25V20.125C11.6875 19.4537 11.9542 18.8098 12.4289 18.3351C12.9036 17.8604 13.5474 17.5938 14.2188 17.5938H17.3828C17.4938 17.5938 17.6486 17.5386 17.8374 17.3326L19.2053 15.1713C19.2271 15.1041 19.2513 15.1041 19.2779 15.0732ZM20.5936 16.1333L19.2274 18.2918C19.2058 18.326 19.1817 18.3586 19.1553 18.3894C18.769 18.8405 18.174 19.2812 17.3828 19.2812H14.2188C13.995 19.2812 13.7804 19.3701 13.6221 19.5284C13.4639 19.6866 13.375 19.9012 13.375 20.125V30.25C13.375 30.4738 13.4639 30.6884 13.6221 30.8466C13.7804 31.0049 13.995 31.0938 14.2188 31.0938H32.7812C33.005 31.0938 33.2196 31.0049 33.3779 30.8466C33.5361 30.6884 33.625 30.4738 33.625 30.25V20.125C33.625 19.9012 33.5361 19.6866 33.3779 19.5284C33.2196 19.3701 33.005 19.2812 32.7812 19.2812H29.6699C28.9066 19.2812 28.2566 18.8703 27.8447 18.3894C27.8183 18.3586 27.7942 18.326 27.7726 18.2918L26.4064 16.1333C26.2547 15.974 26.0859 15.9062 25.9258 15.9062H21.0742C20.9141 15.9062 20.7453 15.974 20.5936 16.1333Z" fill="#585858" />
            <path fillRule="evenodd" clipRule="evenodd" d="M23.5 20.9688C21.636 20.9688 20.125 22.4798 20.125 24.3438C20.125 26.2077 21.636 27.7188 23.5 27.7188C25.364 27.7188 26.875 26.2077 26.875 24.3438C26.875 22.4798 25.364 20.9688 23.5 20.9688ZM18.4375 24.3438C18.4375 21.5478 20.7041 19.2812 23.5 19.2812C26.2959 19.2812 28.5625 21.5478 28.5625 24.3438C28.5625 27.1397 26.2959 29.4062 23.5 29.4062C20.7041 29.4062 18.4375 27.1397 18.4375 24.3438Z" fill="#585858" />
            <path fillRule="evenodd" clipRule="evenodd" d="M14.4297 17.1719C14.4297 16.7059 14.8074 16.3281 15.2734 16.3281H16.5391C17.0051 16.3281 17.3828 16.7059 17.3828 17.1719V18.332C17.3828 18.798 17.0051 19.1758 16.5391 19.1758C16.2871 19.1758 16.0609 19.0653 15.9062 18.8901C15.7516 19.0653 15.5254 19.1758 15.2734 19.1758C14.8074 19.1758 14.4297 18.798 14.4297 18.332V17.1719Z" fill="#585858" />
          </svg>
        </div>

        {/* Judul & Deskripsi */}
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          Select Mode
        </h3>
        <p className="text-sm font-medium text-gray-600 leading-relaxed mb-6">
          Select Local for nearby use or LDR for long-distance.
        </p>

        {/* Grid Tombol Pilihan Opsi */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tombol Local Mode */}
          <button
            onClick={handleSelectLocal}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-xs active:scale-98"
          >
            Local
          </button>

          {/* Wrapper Tombol LDR Mode (Modern Disabled Look) */}
          <div className="relative group w-full">
            {/* Floating Badge 'Soon' di Pojok Kanan Atas */}
            <span className="absolute -top-2 -right-1.5 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs border border-white">
              Soon
            </span>

            {/* Tooltip Melayang Saat Hover */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-medium py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-md z-20">
              Coming soon features!
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>

            {/* Tombol LDR Mode */}
            <button
              disabled
              className="w-full h-full bg-gray-50 border border-gray-200/80 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed text-sm flex items-center justify-center gap-1.5 transition-colors group-hover:bg-gray-100/80"
            >
              <span>LDR</span>
              {/* Icon Lock Kecil Elegant */}
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}