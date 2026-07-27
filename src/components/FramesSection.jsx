'use client';

import React, { useState } from 'react';
import SelectModeModal from '@/components/SelectModeModal';

export default function FramesSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);

  const ITEMS_PER_PAGE = 8;

  // DUMMY DATA FRAMES
  const allFrames = [
    { id: 1, name: 'Zootopia Photostrip', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 2, name: 'Zootopia Frame 2', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 3, name: 'Zootopia Frame 3', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 4, name: 'Zootopia Frame 4', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 5, name: 'Frame 5', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 6, name: 'Frame 6', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 7, name: 'Frame 7', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 8, name: 'Frame 8', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 9, name: 'Frame 9', photosCount: 3, image: '/frames/zootopia.png' },
    { id: 10, name: 'Frame 10', photosCount: 3, image: '/frames/zootopia.png' },
  ];

  const totalPages = Math.ceil(allFrames.length / ITEMS_PER_PAGE);

  const getDisplayedFrames = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allFrames.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const displayedFrames = getDisplayedFrames();

  const handleFrameClick = (frame) => {
    setSelectedFrame(frame);
    setIsModalOpen(true);
  };

  return (
    <section 
      /* 
        Sama persis dengan TopTrendsSection:
        - Padding horizontal simetris (px-6 sm:px-12 lg:px-38 atau lg:px-[9.5rem])
        - Max width max-w-[1800px]
      */
      className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-38 pt-8 sm:pt-12 pb-12 sm:pb-16"
    >
      {/* Grid Container (Ukuran & Gap Disamakan Persis) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
        {displayedFrames.map((frame) => (
          <div
            key={frame.id}
            className="group border border-gray-300 rounded-2xl p-3 flex flex-col bg-white shadow-xs hover:shadow-md transition-all duration-300"
          >
            {/* CONTAINER FRAME (Sama dengan TopTrendsSection) */}
            <div
              onClick={() => handleFrameClick(frame)}
              className="w-full aspect-[3/4] bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden mb-3 p-2 cursor-pointer"
            >
              {/* Gambar Dummy Frame */}
              {frame.image ? (
                <img
                  src={frame.image}
                  alt={frame.name}
                  className="max-w-full max-h-full object-contain drop-shadow-sm rounded transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <svg className="absolute inset-0 w-full h-full text-slate-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}

              {/* Hover Overlay Button */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md text-gray-800 font-bold text-xs sm:text-sm transform scale-95 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 011.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 001.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Take Photo</span>
                </div>
              </div>
            </div>

            {/* Title & Detail Info */}
            <div className="px-1 pb-1">
              <h3 className="text-sm font-bold text-gray-900 mb-0.5">{frame.name}</h3>
              <div className="flex items-center gap-1.5 text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 011.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 001.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-medium">{frame.photosCount} Photos</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center">
        <div className="inline-flex items-center justify-between border border-gray-300 rounded-full py-2 px-4 min-w-[240px] sm:min-w-[280px] bg-white shadow-xs">
          <button
            disabled={currentPage === 1}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-700 select-none">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Selection */}
      <SelectModeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFrame(null);
        }}
        selectedFrame={selectedFrame}
      />
    </section>
  );
}