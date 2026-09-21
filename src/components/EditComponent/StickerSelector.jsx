// src/components/EditComponent/StickerSelector.jsx
'use client';

import React from 'react';
import { STICKER_ITEMS, getStickerDataUrl } from '@/data/stickers';

export default function StickerSelector({
  stickersCount = 0,
  onAddSticker,
  onClearStickers,
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 tracking-tight">
            Stickers
          </h3>
          {stickersCount > 0 && (
            <span className="bg-blue-100 text-blue-700 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full">
              {stickersCount} placed
            </span>
          )}
        </div>

        {stickersCount > 0 && (
          <button
            type="button"
            onClick={onClearStickers}
            className="text-[11px] sm:text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-5 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-2.5 md:gap-3 max-h-[160px] xs:max-h-[180px] sm:max-h-[220px] md:max-h-[240px] overflow-y-auto pr-1 no-scrollbar overscroll-y-contain">
        {STICKER_ITEMS.map((item) => {
          const dataUrl = getStickerDataUrl(item.svg);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onAddSticker({
                  id: `${item.id}-${Date.now()}`,
                  type: item.id,
                  name: item.name,
                  dataUrl,
                  xPercent: 50, // center initially
                  yPercent: 50,
                  sizePercent: 22,
                  rotation: 0,
                })
              }
              className="aspect-square bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 rounded-xl p-1.5 xs:p-2 sm:p-2.5 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer"
              title={`Click to add ${item.name}`}
            >
              <img
                src={dataUrl}
                alt={item.name}
                className="w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:rotate-6"
              />
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-[10px] sm:text-[11px] text-gray-400 mt-2.5">
        Tap any sticker to place it onto your photostrip frame.
      </p>
    </div>
  );
}
