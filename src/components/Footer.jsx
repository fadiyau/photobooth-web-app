'use client';

import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="w-full bg-[#6b7280] text-gray-100 py-8 md:py-12">
      {/* Container disamakan persis dengan Navbar & TopTrends */}
      <div className="mx-auto flex flex-col justify-between gap-8 px-6 sm:px-10 lg:px-16 max-w-[1800px]">
        
        {/* ================= BARIS ATAS: LOGO & MENU ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 pb-2 md:pb-4">
          
          {/* SISI KIRI: LOGO */}
          <div className="flex items-center justify-center md:justify-start gap-2 font-semibold text-lg md:text-xl text-white shrink-0">
            <div className="flex h-6 w-6 items-center justify-center border-2 border-white rounded-sm shrink-0">
              <span className="text-xs font-bold text-white">✕</span>
            </div>
            <span className="tracking-tight truncate">OnlinePhotobooth</span>
          </div>

          {/* SISI KANAN: MENU LINKS */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-8 text-sm md:text-base font-medium">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/frames" className="hover:text-white transition-colors">
              Frames
            </Link>
            <Link href="/gallery" className="hover:text-white transition-colors">
              Gallery
            </Link>
          </div>

        </div>

        {/* ================= GARIS PEMBATAS (DIVIDER) ================= */}
        <hr className="border-t border-gray-400/40" />

        {/* ================= BARIS BAWAH: COPYRIGHT ================= */}
        <div className="text-center text-xs md:text-sm text-gray-200/90">
          <p>OnlinePhotobooth &copy; 2026. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;