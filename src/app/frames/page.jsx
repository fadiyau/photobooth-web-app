'use client';

import React, { useState } from 'react';
import FramesSection from '@/components/FramesSection';
import Footer from '@/components/Footer';

export default function FramePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* ================= HERO SECTION (Teks & Search) ================= */}
        {/* Ubah pt-16 menjadi pt-28 atau pt-32 agar tidak tertutup Navbar */}
        <section className="text-center pt-28 pb-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Bibendum amet at molestie mattis.
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed mb-6">
            Rhoncus morbi et augue nec, in id ullamcorper at sit. Condimentum sit nunc in eros scelerisque sed.
          </p>
        </section>

        {/* ================= FRAMES GRID SECTION ================= */}
        <FramesSection query={searchQuery} />
      </div>
      <Footer />
    </div>
  );
}