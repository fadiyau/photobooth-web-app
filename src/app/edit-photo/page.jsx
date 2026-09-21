// src/app/edit-photo/page.jsx
'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';

// Dynamic client-only import with ssr: false to completely eliminate hydration mismatches with sessionStorage / client state
const EditPhotoContent = dynamic(
  () => import('@/components/EditComponent/EditPhotoContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans pt-16 sm:pt-20 md:pt-24">
        <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-16 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3.5 bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-sm">
            <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs sm:text-sm font-bold text-gray-700 tracking-wide">
              Loading Photobooth Editor...
            </p>
            <p className="text-[11px] text-gray-400">
              Preparing your captured photos & creative tools
            </p>
          </div>
        </main>
        <Footer />
      </div>
    ),
  }
);

export default function EditPhotoPage() {
  return <EditPhotoContent />;
}
