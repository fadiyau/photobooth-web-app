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
            <button className="flex gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-xs transition-colors cursor-pointer lg:text-lg 2xl:text-xl">
              <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3087 5.63688C10.7879 5.07829 11.4862 4.6875 12.3047 4.6875H17.6953C18.5138 4.6875 19.2121 5.07829 19.6913 5.63688C19.7207 5.67123 19.7477 5.70766 19.7719 5.7459L21.2903 8.14507C21.4815 8.3478 21.7005 8.4375 21.8555 8.4375H25.3125C26.0584 8.4375 26.7738 8.73382 27.3012 9.26126C27.8287 9.78871 28.125 10.5041 28.125 11.25V22.5C28.125 23.2459 27.8287 23.9613 27.3012 24.4887C26.7738 25.0162 26.0584 25.3125 25.3125 25.3125H4.6875C3.94158 25.3125 3.22621 25.0162 2.69876 24.4887C2.17132 23.9613 1.875 23.2459 1.875 22.5V11.25C1.875 10.5041 2.17132 9.78871 2.69876 9.26126C3.22621 8.73382 3.94158 8.4375 4.6875 8.4375H8.20312C8.32639 8.4375 8.49839 8.37627 8.70827 8.14732L10.2281 5.7459C10.2523 5.70766 10.2793 5.67123 10.3087 5.63688ZM11.7706 6.81475L10.2527 9.21309C10.2286 9.25112 10.2019 9.28738 10.1726 9.32157C9.74334 9.82272 9.08222 10.3125 8.20312 10.3125H4.6875C4.43886 10.3125 4.2004 10.4113 4.02459 10.5871C3.84877 10.7629 3.75 11.0014 3.75 11.25V22.5C3.75 22.7486 3.84877 22.9871 4.02459 23.1629C4.2004 23.3387 4.43886 23.4375 4.6875 23.4375H25.3125C25.5611 23.4375 25.7996 23.3387 25.9754 23.1629C26.1512 22.9871 26.25 22.7486 26.25 22.5V11.25C26.25 11.0014 26.1512 10.7629 25.9754 10.5871C25.7996 10.4113 25.5611 10.3125 25.3125 10.3125H21.8555C21.0073 10.3125 20.2851 9.85591 19.8274 9.32157C19.7981 9.28738 19.7714 9.25112 19.7473 9.21309L18.2294 6.81475C18.0608 6.63775 17.8733 6.5625 17.6953 6.5625H12.3047C12.1267 6.5625 11.9392 6.63775 11.7706 6.81475Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15 12.1875C12.9289 12.1875 11.25 13.8664 11.25 15.9375C11.25 18.0086 12.9289 19.6875 15 19.6875C17.0711 19.6875 18.75 18.0086 18.75 15.9375C18.75 13.8664 17.0711 12.1875 15 12.1875ZM9.375 15.9375C9.375 12.8309 11.8934 10.3125 15 10.3125C18.1066 10.3125 20.625 12.8309 20.625 15.9375C20.625 19.0441 18.1066 21.5625 15 21.5625C11.8934 21.5625 9.375 19.0441 9.375 15.9375Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.92188 7.96875C4.92188 7.45098 5.34161 7.03125 5.85938 7.03125H7.26562C7.78339 7.03125 8.20312 7.45098 8.20312 7.96875V9.25781C8.20312 9.77558 7.78339 10.1953 7.26562 10.1953C6.98562 10.1953 6.73428 10.0726 6.5625 9.87793C6.39072 10.0726 6.13938 10.1953 5.85938 10.1953C5.34161 10.1953 4.92188 9.77558 4.92188 9.25781V7.96875Z" fill="white"/>
              </svg>

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