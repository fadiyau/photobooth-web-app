// src/components/EditComponent/EditPhotoContent.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PhotoStripCanvas from '@/components/EditComponent/PhotoStripCanvas';
import FilterSelector from '@/components/EditComponent/FilterSelector';
import StickerSelector from '@/components/EditComponent/StickerSelector';
import ActionButtons from '@/components/EditComponent/ActionButtons';
import LoginRequiredModal from '@/components/LoginRequiredModal';
import Footer from '@/components/Footer';
import {
  renderPhotostripCanvas,
  downloadDataUrl,
  saveToLocalGallery,
} from '@/utils/canvasExport';

// Sample fallback portraits for direct page testing / preview
const SAMPLE_PHOTOS = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="100%" height="100%" fill="%23fecdd3"/><circle cx="300" cy="210" r="90" fill="%23fb7185"/><path d="M 170 420 C 180 310 420 310 430 420 Z" fill="%23e11d48"/><circle cx="270" cy="200" r="10" fill="%23ffffff"/><circle cx="330" cy="200" r="10" fill="%23ffffff"/><path d="M 280 240 Q 300 260 320 240" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/><text x="300" y="470" font-family="sans-serif" font-size="20" font-weight="bold" fill="%239f1239" text-anchor="middle">Sample Photo 1</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="100%" height="100%" fill="%23fed7aa"/><circle cx="300" cy="210" r="90" fill="%23fb923c"/><path d="M 170 420 C 180 310 420 310 430 420 Z" fill="%23ea580c"/><circle cx="270" cy="200" r="10" fill="%23ffffff"/><circle cx="330" cy="200" r="10" fill="%23ffffff"/><path d="M 280 240 Q 300 260 320 240" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/><text x="300" y="470" font-family="sans-serif" font-size="20" font-weight="bold" fill="%239a3412" text-anchor="middle">Sample Photo 2</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="100%" height="100%" fill="%23fef08a"/><circle cx="300" cy="210" r="90" fill="%23facc15"/><path d="M 170 420 C 180 310 420 310 430 420 Z" fill="%23ca8a04"/><circle cx="270" cy="200" r="10" fill="%23ffffff"/><circle cx="330" cy="200" r="10" fill="%23ffffff"/><path d="M 275 235 Q 300 265 325 235" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/><text x="300" y="470" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23854d0e" text-anchor="middle">Sample Photo 3</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="100%" height="100%" fill="%23bbf7d0"/><circle cx="300" cy="210" r="90" fill="%234ade80"/><path d="M 170 420 C 180 310 420 310 430 420 Z" fill="%2316a34a"/><circle cx="270" cy="200" r="10" fill="%23ffffff"/><circle cx="330" cy="200" r="10" fill="%23ffffff"/><path d="M 280 240 Q 300 260 320 240" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/><text x="300" y="470" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23166534" text-anchor="middle">Sample Photo 4</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="100%" height="100%" fill="%23bae6fd"/><circle cx="300" cy="210" r="90" fill="%2338bdf8"/><path d="M 170 420 C 180 310 420 310 430 420 Z" fill="%230284c7"/><circle cx="270" cy="200" r="10" fill="%23ffffff"/><circle cx="330" cy="200" r="10" fill="%23ffffff"/><path d="M 280 240 Q 300 260 320 240" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/><text x="300" y="470" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23075985" text-anchor="middle">Sample Photo 5</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="100%" height="100%" fill="%23e9d5ff"/><circle cx="300" cy="210" r="90" fill="%23c084fc"/><path d="M 170 420 C 180 310 420 310 430 420 Z" fill="%239333ea"/><circle cx="270" cy="200" r="10" fill="%23ffffff"/><circle cx="330" cy="200" r="10" fill="%23ffffff"/><path d="M 280 240 Q 300 260 320 240" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/><text x="300" y="470" font-family="sans-serif" font-size="20" font-weight="bold" fill="%236b21a8" text-anchor="middle">Sample Photo 6</text></svg>',
];

export default function EditPhotoContent() {
  // State initialized on client
  const [photos] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedPhotos = sessionStorage.getItem('photobooth_photos');
        if (storedPhotos) {
          const parsed = JSON.parse(storedPhotos);
          if (Array.isArray(parsed) && parsed.some((p) => p !== null)) {
            return parsed.map((p, i) => p || SAMPLE_PHOTOS[i]);
          }
        }
      } catch (err) {
        console.warn('Could not read photos from sessionStorage:', err);
      }
    }
    return SAMPLE_PHOTOS;
  });

  const [isDemoMode] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedPhotos = sessionStorage.getItem('photobooth_photos');
        if (storedPhotos) {
          const parsed = JSON.parse(storedPhotos);
          if (Array.isArray(parsed) && parsed.some((p) => p !== null)) {
            return false;
          }
        }
      } catch (err) {}
    }
    return true;
  });

  const [selectedFilter, setSelectedFilter] = useState('none');
  const [stickers, setStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);

  // Status & Auth & Notification
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Check login authentication status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          if (isMounted) setIsLoggedIn(true);
        } else {
          if (isMounted) setIsLoggedIn(false);
        }
      } catch (err) {
        if (isMounted) setIsLoggedIn(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sticker operations
  const handleAddSticker = (newSticker) => {
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleUpdateSticker = (id, changes) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...changes } : s))
    );
  };

  const handleDeleteSticker = (id) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
  };

  const handleClearStickers = () => {
    if (window.confirm('Remove all stickers from this photostrip?')) {
      setStickers([]);
      setSelectedStickerId(null);
    }
  };

  // Save to Gallery Handler
  const handleSaveToGallery = async () => {
    // If not logged in, prompt the login required modal
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      setIsSaving(true);

      const highResDataUrl = await renderPhotostripCanvas({
        photos,
        filterId: selectedFilter,
        stickers,
        format: 'image/png',
      });

      saveToLocalGallery(highResDataUrl, 'Photobooth Strip');
      setToastMessage('Saved successfully to My Gallery! 🎉');
    } catch (err) {
      console.error('Failed to save photo:', err);
      setToastMessage('Failed to save to gallery. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Download Handler (PNG or JPEG)
  const handleDownload = async (format = 'image/png') => {
    try {
      setIsDownloading(true);

      const isJpeg = format === 'image/jpeg';
      const extension = isJpeg ? 'jpg' : 'png';
      const filename = `photobooth-${Date.now()}.${extension}`;

      const highResDataUrl = await renderPhotostripCanvas({
        photos,
        filterId: selectedFilter,
        stickers,
        format,
        quality: 0.95,
      });

      downloadDataUrl(highResDataUrl, filename);
      setToastMessage(`Downloading your photostrip as ${extension.toUpperCase()}! 📸`);
    } catch (err) {
      console.error('Failed to download photo:', err);
      setToastMessage('Failed to generate download. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans pt-16 sm:pt-20 md:pt-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 sm:top-24 left-4 right-4 sm:left-auto sm:right-8 z-50 bg-gray-900 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between sm:justify-start gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
            {toastMessage.includes('Gallery') && (
              <Link
                href="/gallery"
                className="ml-2 text-blue-400 hover:text-blue-300 underline font-bold inline-flex items-center gap-1"
              >
                <span>View Gallery</span>
                <span>→</span>
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white cursor-pointer ml-2 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-[1400px] w-full mx-auto px-3 sm:px-6 lg:px-10 xl:px-12 py-4 sm:py-6 md:py-8 flex-1 flex flex-col justify-center">
        {/* Top Navigation Bar Helper */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link
            href="/local-mode"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Retake / Back to Booth</span>
          </Link>

          {isDemoMode && (
            <span className="bg-amber-100 text-amber-800 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-200">
              ⚡ Demo Mode
            </span>
          )}
        </div>

        {/* 2-Column Responsive Grid (Side-by-side from 'md' 768px screens upwards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 xl:gap-12 items-start">
          {/* ================= LEFT COLUMN: PHOTO STRIP PREVIEW ================= */}
          <div className="md:col-span-5 lg:col-span-5 flex justify-center md:sticky md:top-24 w-full">
            <PhotoStripCanvas
              photos={photos}
              selectedFilter={selectedFilter}
              stickers={stickers}
              selectedStickerId={selectedStickerId}
              onSelectSticker={(id) => setSelectedStickerId(id)}
              onUpdateSticker={handleUpdateSticker}
              onDeleteSticker={handleDeleteSticker}
              onDeselectSticker={() => setSelectedStickerId(null)}
            />
          </div>

          {/* ================= RIGHT COLUMN: FILTERS, STICKERS, ACTIONS ================= */}
          <div className="md:col-span-7 lg:col-span-7 flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full">
            {/* Section 1: Filters */}
            <FilterSelector
              selectedFilter={selectedFilter}
              onSelectFilter={(filterId) => setSelectedFilter(filterId)}
            />

            {/* Section 2: Stickers */}
            <StickerSelector
              stickersCount={stickers.length}
              onAddSticker={handleAddSticker}
              onClearStickers={handleClearStickers}
            />

            {/* Section 3: Action Buttons */}
            <ActionButtons
              isLoggedIn={isLoggedIn}
              isSaving={isSaving}
              isDownloading={isDownloading}
              onSaveToGallery={handleSaveToGallery}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </main>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Log In to Save"
        description="Please log in to save your photostrips to your personal gallery and view them anytime."
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
