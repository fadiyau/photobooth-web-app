// src/components/EditComponent/PhotoStripCanvas.jsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FILTERS } from '@/utils/canvasExport';

export default function PhotoStripCanvas({
  photos = [],
  selectedFilter = 'none',
  stickers = [],
  selectedStickerId = null,
  onSelectSticker,
  onUpdateSticker,
  onDeleteSticker,
  onDeselectSticker,
}) {
  const containerRef = useRef(null);
  const [activeDrag, setActiveDrag] = useState(null);

  const currentFilter = FILTERS.find((f) => f.id === selectedFilter) || FILTERS[0];

  // Mouse & Touch Dragging Handlers
  const handlePointerDown = (e, sticker, actionType) => {
    e.stopPropagation();
    onSelectSticker(sticker.id);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setActiveDrag({
      type: actionType,
      id: sticker.id,
      startX: clientX,
      startY: clientY,
      origX: sticker.xPercent,
      origY: sticker.yPercent,
      origSize: sticker.sizePercent,
      origRotation: sticker.rotation || 0,
    });
  };

  useEffect(() => {
    if (!activeDrag) return;

    const handlePointerMove = (e) => {
      if (!containerRef.current || !activeDrag) return;

      // Prevent native touch scrolling while actively manipulating sticker
      if (e.cancelable) {
        e.preventDefault();
      }

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - activeDrag.startX;
      const deltaY = clientY - activeDrag.startY;

      if (activeDrag.type === 'move') {
        const deltaXPercent = (deltaX / rect.width) * 100;
        const deltaYPercent = (deltaY / rect.height) * 100;

        const newX = Math.max(5, Math.min(95, activeDrag.origX + deltaXPercent));
        const newY = Math.max(5, Math.min(95, activeDrag.origY + deltaYPercent));

        onUpdateSticker(activeDrag.id, { xPercent: newX, yPercent: newY });
      } else if (activeDrag.type === 'resize') {
        const deltaSizePercent = ((deltaX + deltaY) / rect.width) * 50;
        const newSize = Math.max(8, Math.min(45, activeDrag.origSize + deltaSizePercent));

        onUpdateSticker(activeDrag.id, { sizePercent: newSize });
      } else if (activeDrag.type === 'rotate') {
        const stickerEl = document.getElementById(`sticker-${activeDrag.id}`);
        if (stickerEl) {
          const sRect = stickerEl.getBoundingClientRect();
          const centerX = sRect.left + sRect.width / 2;
          const centerY = sRect.top + sRect.height / 2;
          const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
          const angleDeg = (angleRad * 180) / Math.PI + 90;

          onUpdateSticker(activeDrag.id, { rotation: Math.round(angleDeg) });
        }
      }
    };

    const handlePointerUp = () => {
      setActiveDrag(null);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [activeDrag, onUpdateSticker]);

  // Keyboard delete support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedStickerId) {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        onDeleteSticker(selectedStickerId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStickerId, onDeleteSticker]);

  return (
    <div
      onClick={onDeselectSticker}
      className="w-full flex items-center justify-center select-none"
    >
      {/* Outer Card Wrapper (Wireframe Style: Rounded Card, responsive width & max-height) */}
      <div className="relative bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-xl shadow-slate-200/50 w-full max-w-[270px] xs:max-w-[300px] sm:max-w-[340px] md:max-w-[360px] lg:max-w-[390px] xl:max-w-[420px] transition-all flex flex-col items-center">
        
        {/* Photostrip Frame Container: strictly maintains 3:4.4 ratio, no overflow */}
        <div
          ref={containerRef}
          id="photostrip-canvas-container"
          className="relative bg-white border-2 border-gray-300 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 md:p-4 shadow-inner overflow-hidden aspect-[3/4.4] w-full flex flex-col justify-between"
        >
          {/* Photos Grid: 2 columns x 3 rows - perfectly fills available vertical space */}
          <div className="grid grid-cols-2 grid-rows-3 gap-1.5 sm:gap-2 md:gap-2.5 flex-1 min-h-0">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const photo = photos[index];

              return (
                <div
                  key={index}
                  className="relative w-full h-full min-h-0 bg-gray-100 rounded-md sm:rounded-lg overflow-hidden border border-gray-200/70 shadow-2xs flex items-center justify-center group"
                >
                  {photo ? (
                    <img
                      src={photo}
                      alt={`Captured Photo ${index + 1}`}
                      style={{ filter: currentFilter.cssFilter }}
                      className="w-full h-full object-cover transition-all duration-300 pointer-events-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-0.5">
                      <svg
                        className="w-4 h-4 opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[9px] font-bold text-gray-400">
                        Slot {index + 1}
                      </span>
                    </div>
                  )}

                  {/* Slot Number Badge */}
                  <div className="absolute bottom-1 right-1 bg-black/40 text-white text-[8px] sm:text-[9px] font-semibold px-1 py-0.2 rounded backdrop-blur-xs pointer-events-none">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Photobooth Strip Footer Branding */}
          <div className="pt-2 sm:pt-2.5 pb-0.5 text-center border-t border-dashed border-gray-200 mt-1.5 pointer-events-none shrink-0">
            <p className="text-[9px] sm:text-[11px] font-black tracking-widest text-gray-700 uppercase">
              ★ Online Photobooth ★
            </p>
            <p suppressHydrationWarning className="text-[8px] sm:text-[9px] text-gray-400 font-medium tracking-wide">
              {new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* ================= STICKERS INTERACTIVE LAYER ================= */}
          {stickers.map((sticker) => {
            const isSelected = selectedStickerId === sticker.id;

            return (
              <div
                key={sticker.id}
                id={`sticker-${sticker.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSticker(sticker.id);
                }}
                onMouseDown={(e) => handlePointerDown(e, sticker, 'move')}
                onTouchStart={(e) => handlePointerDown(e, sticker, 'move')}
                style={{
                  position: 'absolute',
                  left: `${sticker.xPercent}%`,
                  top: `${sticker.yPercent}%`,
                  width: `${sticker.sizePercent}%`,
                  aspectRatio: '1 / 1', // Guarantees 1:1 square ratio without vertical distortion!
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation || 0}deg)`,
                  touchAction: 'none',
                }}
                className={`cursor-grab active:cursor-grabbing transition-shadow ${
                  isSelected
                    ? 'z-30 ring-2 ring-blue-500 ring-dashed rounded-lg p-0.5'
                    : 'z-20 hover:ring-1 hover:ring-blue-300 hover:ring-dashed'
                }`}
              >
                {/* Sticker Graphic */}
                <img
                  src={sticker.dataUrl}
                  alt="Sticker"
                  className="w-full h-full object-contain pointer-events-none drop-shadow-md"
                  draggable={false}
                />

                {/* Control Handles (When Selected - Generous touch targets for mobile) */}
                {isSelected && (
                  <>
                    {/* Delete Button (Top-Right) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSticker(sticker.id);
                      }}
                      className="absolute -top-3.5 -right-3.5 w-6 h-6 sm:w-5 sm:h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-700 cursor-pointer transition-transform active:scale-90 z-40"
                      title="Delete sticker"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Rotate Handle (Top-Center) */}
                    <div
                      onMouseDown={(e) => handlePointerDown(e, sticker, 'rotate')}
                      onTouchStart={(e) => handlePointerDown(e, sticker, 'rotate')}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-5 sm:h-5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing z-40 touch-none"
                      title="Rotate sticker"
                    >
                      <svg
                        className="w-3 h-3 sm:w-2.5 sm:h-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>

                    {/* Resize Handle (Bottom-Right) */}
                    <div
                      onMouseDown={(e) => handlePointerDown(e, sticker, 'resize')}
                      onTouchStart={(e) => handlePointerDown(e, sticker, 'resize')}
                      className="absolute -bottom-3 -right-3 w-6 h-6 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md cursor-nwse-resize z-40 touch-none"
                      title="Resize sticker"
                    >
                      <svg
                        className="w-3 h-3 sm:w-2.5 sm:h-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Small Tip Under Photo */}
        <p className="text-[10px] sm:text-[11px] text-gray-400 text-center mt-2.5 font-medium leading-tight">
          💡 Drag sticker to reposition, use handles to rotate & resize.
        </p>
      </div>
    </div>
  );
}
