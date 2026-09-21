// src/components/EditComponent/ActionButtons.jsx
'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function ActionButtons({
  isSaving = false,
  isDownloading = false,
  onSaveToGallery,
  onDownload,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3 pt-1">
      {/* 1. Save to My Gallery Button (Outline Blue with Icon) */}
      <button
        type="button"
        onClick={onSaveToGallery}
        disabled={isSaving || isDownloading}
        className={`flex-1 py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl border-2 border-blue-600 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
          isSaving
            ? 'bg-blue-50 text-blue-400 border-blue-300 cursor-not-allowed'
            : 'bg-white text-blue-600 hover:bg-blue-50/80 hover:shadow-md'
        }`}
      >
        {isSaving ? (
          <>
            <svg
              className="w-4 h-4 animate-spin text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 text-blue-600 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="truncate">Save to My Gallery</span>
          </>
        )}
      </button>

      {/* 2. Download Button with Split Dropdown (Solid Blue) */}
      <div ref={dropdownRef} className="relative flex-1 flex">
        {/* Main Download Button */}
        <button
          type="button"
          onClick={() => onDownload('image/png')}
          disabled={isDownloading || isSaving}
          className={`flex-1 py-2.5 sm:py-3 px-4 rounded-l-xl sm:rounded-l-2xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 ${
            isDownloading
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {isDownloading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 text-white shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download</span>
            </>
          )}
        </button>

        {/* Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          disabled={isDownloading || isSaving}
          className={`px-3 py-2.5 sm:py-3 rounded-r-xl sm:rounded-r-2xl border-l border-blue-500 font-bold transition-all cursor-pointer shadow-sm ${
            isDownloading
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          title="Choose download format"
        >
          <svg
            className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-48 sm:w-52 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="px-3 py-1 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Format
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                onDownload('image/png');
              }}
              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>PNG (HD)</span>
              <span className="text-[9px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded">
                Best
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                onDownload('image/jpeg');
              }}
              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>JPEG</span>
              <span className="text-[9px] text-gray-400">Compact</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
