// src/components/EditComponent/FilterSelector.jsx
'use client';

import React from 'react';
import { FILTERS } from '@/utils/canvasExport';

export default function FilterSelector({ selectedFilter, onSelectFilter }) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 tracking-tight">
          Filters
        </h3>
        <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
          {FILTERS.length} tones
        </span>
      </div>

      {/* Filters Circular List (Horizontal Scroll / Row with smooth touch scrolling) */}
      <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar overscroll-x-contain">
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onSelectFilter(filter.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none transition-transform active:scale-95"
            >
              {/* Filter Circle Preview */}
              <div
                style={{ background: filter.previewGradient }}
                className={`w-11 h-11 xs:w-12 xs:h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xs relative ${
                  isSelected
                    ? 'ring-3 ring-blue-600 ring-offset-2 scale-105 shadow-md'
                    : 'group-hover:scale-105 group-hover:shadow border border-gray-200'
                }`}
              >
                {/* Active Checkmark Icon */}
                {isSelected && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Filter Name */}
              <span
                className={`text-[10px] xs:text-[11px] sm:text-xs font-semibold tracking-wide transition-colors ${
                  isSelected ? 'text-blue-600 font-bold' : 'text-gray-600 group-hover:text-gray-900'
                }`}
              >
                {filter.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
