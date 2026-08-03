'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DownloadModal from '@/components/DownloadModal';
import DeleteModal from '@/components/DeleteModal';
import Footer from '@/components/Footer';

// Helper untuk mengambil inisial dari nama atau username
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function GalleryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk melacak kartu yang sedang aktif
  const [activePhotoId, setActivePhotoId] = useState(null);

  // State Download & Delete Modal
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [photos, setPhotos] = useState([
    { id: 1, title: 'Frame 1', date: 'July 13, 2026, 11:11 PM.', imageUrl: '' },
    { id: 2, title: 'Frame 4', date: 'July 13, 2026, 11:11 PM.', imageUrl: '' },
  ]);

  // Efek untuk mengecek status login saat komponen pertama kali dirender
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setUser(data.user || data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleCardClick = (id) => {
    setActivePhotoId((prev) => (prev === id ? null : id));
  };

  const handleOpenDelete = (photo) => {
    setSelectedPhoto(photo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPhoto) {
      setPhotos(photos.filter((p) => p.id !== selectedPhoto.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleOpenDownload = (photo) => {
    setSelectedPhoto(photo);
    setIsDownloadModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 font-semibold animate-pulse">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans select-none pt-16 md:pt-20">
      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <main className="w-full max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-38 pt-8 pb-16 flex-1 flex flex-col justify-between">
        {!isLoggedIn ? (
          /* ---------------- 1. STATE UNAUTHENTICATED ---------------- */
          <div className="flex-1 flex flex-col justify-between">
            <div className="w-full flex justify-between items-start mb-16">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  My Gallery
                </h1>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 0120 14m-6-6h.01M6 20h12a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>0 Photos</span>
                </div>
              </div>

              <Link
                href="/frames"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span>New Photo</span>
              </Link>
            </div>

            <div className="my-auto py-12 flex flex-col items-center justify-center text-center">
              <div className="mb-6 text-gray-900">
                <svg
                  className="w-24 h-24 sm:w-28 sm:h-28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
                </svg>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                Gallery is locked.
              </h2>
              <p className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                Please{' '}
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline cursor-pointer focus:outline-none"
                >
                  log in
                </Link>{' '}
                to unlock it.
              </p>
            </div>
          </div>
        ) : (
          /* ---------------- 2. STATE AUTHENTICATED ---------------- */
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 pb-10 border-b border-gray-200">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Lingkaran Inisial Profil sesuai Navbar */}
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#E9ECEF] text-[#6C757D] font-bold text-2xl sm:text-4xl flex items-center justify-center shrink-0 tracking-wider">
                    {getInitials(user?.name || user?.username)}
                  </div>

                  <div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {user?.username || user?.name || 'Username'}
                    </h1>
                    <p className="text-xs sm:text-base text-gray-600 font-medium mt-0.5">
                      {user?.email || 'username@gmail.com'}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mt-1.5">
                      <svg 
                        xmlns="http://w3.org" 
                        viewBox="0 0 24 24" 
                        width="24" 
                        height="24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <rect x="2.5" y="2.5" width="19" height="19" rx="6" ry="6" />
                        <circle cx="8" cy="8" r="1.5" />
                        <path d="M3 18.5 L7.5 14 L12 18.5 L16.5 11.5 L21 16" />
                      </svg>


                      <span>{photos.length} Photos</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/frames"
                  className="self-start bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 sm:py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap mt-2 sm:mt-0"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  <span>New Photo</span>
                </Link>
              </div>

              {/* Photo Cards Grid */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((item) => {
                  const isActive = activePhotoId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.id)}
                      className="group border border-gray-200 rounded-3xl bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative"
                    >
                      <div className="w-full aspect-[3/4] bg-[#E2E8F0] relative flex items-center justify-center p-4">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-2xl pointer-events-none"
                          />
                        ) : (
                          <div className="w-full h-full border-2 border-white rounded-xl relative flex items-center justify-center bg-[#E2E8F0] pointer-events-none">
                            <svg
                              className="absolute inset-0 w-full h-full text-white/80"
                              preserveAspectRatio="none"
                              viewBox="0 0 100 100"
                            >
                              <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="3" />
                              <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="3" />
                            </svg>
                          </div>
                        )}

                        {/* OVERLAY ACTION BUTTONS */}
                        <div
                          className={`absolute inset-0 bg-black/20 transition-all duration-200 flex items-center justify-center gap-3 ${
                            isActive
                              ? 'opacity-100 pointer-events-auto'
                              : 'opacity-0 sm:group-hover:opacity-100 pointer-events-none sm:group-hover:pointer-events-auto'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isActive || window.innerWidth >= 640) {
                                handleOpenDownload(item);
                              }
                            }}
                            className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 shadow transition-transform active:scale-90 cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isActive || window.innerWidth >= 640) {
                                handleOpenDelete(item);
                              }
                            }}
                            className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-600 shadow transition-transform active:scale-90 cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-white pointer-events-none">
                        <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">{item.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Box */}
            <div className="mt-16 flex justify-center">
              <div className="inline-flex items-center justify-between border border-gray-200 rounded-full py-2 px-6 bg-white shadow-xs text-xs font-bold text-gray-700 gap-8">
                <button className="text-gray-300 hover:text-gray-600 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm">Page 1</span>
                <button className="text-gray-300 hover:text-gray-600 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        selectedPhoto={selectedPhoto}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}