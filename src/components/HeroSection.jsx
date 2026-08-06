import React from 'react';

export default function HeroSection() {
  return (
    <section className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-38 py-25 sm:py-35 2xl:py-50  min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
        
        {/* Teks Kiri */}
        <div className="md:col-span-7 space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
            Capture Beautiful Moments with a Free Online Photobooth
          </h1>
          
          <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
            Snap, style, and download your favorite moments with our free frames and filters.
          </p>
          
          <div className="pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-xs transition-colors cursor-pointer">
              Try it now!
            </button>
          </div>
        </div>

        {/* Gambar Kanan */}
        <div className="md:col-span-5 flex justify-end">
          {/* Tambahkan 2xl:max-w-[500px] agar di resolusi 1920px gambarnya lebih besar */}
          <div className="bg-gray-200 aspect-square w-full max-w-[420px] 2xl:max-w-[500px] rounded-2xl flex items-center justify-center border border-gray-300 shadow-xs overflow-hidden transition-all">
            <img 
              src="/heroimg.png" 
              alt="Online Photobooth Hero" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}