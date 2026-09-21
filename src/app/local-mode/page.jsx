'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LocalModePage() {
  const router = useRouter();

  // --- STATE LOGIC ---
  const [timerStage, setTimerStage] = useState(0); 
  const [countdown, setCountdown] = useState(null); 
  const [isMirror, setIsMirror] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' (depan) atau 'environment' (belakang)
  const [isFlashOn, setIsFlashOn] = useState(false); 
  const [isFlashTriggered, setIsFlashTriggered] = useState(false); 
  const [isLive, setIsLive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [isCapturingSeries, setIsCapturingSeries] = useState(false); 

  const [photos, setPhotos] = useState([
    null, null, null, null, null, null
  ]);

  // --- REFS ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photosRef = useRef(photos);
  const timerTimeoutRef = useRef(null); 

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    };
  }, []);

  // --- CAMERA INIT & FLIP LOGIC ---
  useEffect(() => {
    let localStream = null;

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    navigator.mediaDevices
      .getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: facingMode } 
      })
      .then((stream) => {
        localStream = stream;
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Gagal mengakses kamera: ", err);
        alert("Aplikasi membutuhkan izin kamera untuk berfungsi.");
      });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (timerTimeoutRef.current) {
        clearTimeout(timerTimeoutRef.current);
      }
    };
  }, [facingMode]);

  // --- HANDLERS ---
  const handleTimerTap = () => {
    if (isCapturingSeries) return; 
    setTimerStage((prev) => (prev + 1) % 4);
  };

  const handleFlipCamera = () => {
    if (isCapturingSeries) return;
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const getTimerLabel = () => {
    if (timerStage === 1) return '3s';
    if (timerStage === 2) return '5s';
    if (timerStage === 3) return '10s';
    return 'OFF';
  };

  const getTimerSeconds = () => {
    if (timerStage === 1) return 3;
    if (timerStage === 2) return 5;
    if (timerStage === 3) return 10;
    return 0;
  };

  const takenPhotosCount = photos.filter(p => p !== null).length;
  const isPhotosComplete = takenPhotosCount === 6;

  const handleResetPhotos = () => {
    if (window.confirm("Apakah kamu yakin ingin mengulang semua foto dari awal?")) {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      setPhotos([null, null, null, null, null, null]);
      setIsCapturingSeries(false);
      setCountdown(null);
    }
  };

  const capturePhoto = () => {
    const nextEmptyIndex = photosRef.current.findIndex(p => p === null);
    if (nextEmptyIndex === -1) return false;

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (isMirror) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');

      const updatedPhotos = [...photosRef.current];
      updatedPhotos[nextEmptyIndex] = imageDataUrl;
      setPhotos(updatedPhotos);

      if (isFlashOn) {
        setIsFlashTriggered(true);
        setTimeout(() => setIsFlashTriggered(false), 150);
      }

      return true;
    }
    return false;
  };

  const runSingleCountdown = (currentSeconds) => {
    const delay = timerStage === 0 ? 500 : 1000;

    const nextEmptyIndex = photosRef.current.findIndex(p => p === null);
    if (nextEmptyIndex === -1) {
      setIsCapturingSeries(false);
      setCountdown(null);
      return;
    }

    if (currentSeconds > 0) {
      setCountdown(currentSeconds);
      timerTimeoutRef.current = setTimeout(() => {
        runSingleCountdown(currentSeconds - 1);
      }, delay);
    } else {
      setCountdown(null);
      capturePhoto();

      const checkNextIndex = photosRef.current.findIndex(p => p === null);
      if (checkNextIndex !== -1) {
        timerTimeoutRef.current = setTimeout(() => {
          const nextStartSeconds = getTimerSeconds() > 0 ? getTimerSeconds() : 1;
          runSingleCountdown(nextStartSeconds);
        }, delay);
      } else {
        setIsCapturingSeries(false);
      }
    }
  };

  const handleCaptureClick = () => {
    const nextEmptyIndex = photos.findIndex(p => p === null);
    if (nextEmptyIndex === -1) {
      alert("Slot foto sudah penuh! Silakan reset terlebih dahulu.");
      return;
    }

    if (isCapturingSeries) return; 

    setIsCapturingSeries(true);
    const startSeconds = getTimerSeconds() > 0 ? getTimerSeconds() : 1;
    runSingleCountdown(startSeconds);
  };

  const handleRetake = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index] = null;
    setPhotos(updatedPhotos);
  };

  const handleContinueToEdit = () => {
    if (!isPhotosComplete || isCapturingSeries) return;
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('photobooth_photos', JSON.stringify(photos));
      }
    } catch (err) {
      console.error('Gagal menyimpan foto ke sessionStorage:', err);
    }
    router.push('/edit-photo');
  };

  return (
    <div className="w-full min-h-screen bg-white pt-20 md:pt-24 pb-12 px-4 md:px-8 flex items-center justify-center select-none">
      
      {/* FLASH SCREEN */}
      {isFlashTriggered && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none transition-none" />
      )}

      {/* Canvas Tersembunyi */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 md:items-stretch justify-center">
        
        {/* ================= SISI KIRI: PANEL KAMERA ================= */}
        <div className="md:col-span-7 w-full flex">
          <div className="w-full aspect-[4/3] bg-black rounded-3xl relative overflow-hidden border border-gray-300 shadow-md flex flex-col justify-between p-3 md:p-4">
            
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover z-0 ${isMirror ? 'scale-x-[-1]' : ''}`}
            />

            {/* Overlay Countdown */}
            {countdown !== null && timerStage > 0 && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20 pointer-events-none">
                <span className="text-white text-8xl font-black tracking-wider drop-shadow-lg animate-pulse">
                  {countdown}
                </span>
              </div>
            )}

            {/* Top Bar Controls */}
            <div className="flex items-center justify-center gap-1 md:gap-2 z-10 w-full flex-nowrap overflow-x-auto no-scrollbar">
              
              {/* TIMER */}
              <button 
                type="button"
                onClick={handleTimerTap}
                disabled={isCapturingSeries}
                className={`px-1.5 md:px-3 py-1 md:py-1.5 rounded-full text-[8.5px] md:text-xs font-bold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-0.5 md:gap-1 border border-white/40 backdrop-blur-md shrink-0 ${
                  isCapturingSeries ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  timerStage > 0 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-black/50 text-gray-200 hover:bg-black/80'
                }`}
              >
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>
                  <span className="inline md:hidden">{getTimerLabel()}</span>
                  <span className="hidden md:inline">TIMER: {getTimerLabel()}</span>
                </span>
              </button>

              {/* MIRROR */}
              <button 
                type="button"
                onClick={() => setIsMirror(!isMirror)}
                className={`px-1.5 md:px-3 py-1 md:py-1.5 rounded-full text-[8.5px] md:text-xs font-bold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-0.5 md:gap-1 border border-white/40 backdrop-blur-md shrink-0 ${
                  isMirror 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-black/50 text-gray-200 hover:bg-black/80'
                }`}
              >
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 2"/>
                  <path d="M10 6L4 12L10 18V6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                  <path d="M14 6L20 12L14 18V6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                </svg>
                <span>MIRROR</span>
              </button>

              {/* FLIP CAMERA (KHUSUS MOBILE: md:hidden) */}
              <button 
                type="button"
                onClick={handleFlipCamera}
                disabled={isCapturingSeries}
                className={`md:hidden px-1.5 py-1 rounded-full text-[8.5px] font-bold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-0.5 border border-white/40 backdrop-blur-md shrink-0 ${
                  isCapturingSeries ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  facingMode === 'environment'
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-black/50 text-gray-200 hover:bg-black/80'
                }`}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0-4.418-3.582-8-8-8s-8 3.582-8 8h3l-4 4-4-4h3c0-6.075 4.925-11 11-11s11 4.925 11 11h-2z" />
                  <path d="M4 14c0 4.418 3.582 8 8 8s8-3.582 8-8h-3l4-4 4 4h-3c0 6.075-4.925 11-11 11s-11-4.925-11-11h2z" />
                </svg>
                <span>FLIP</span>
              </button>

              {/* FLASH */}
              <button 
                type="button"
                onClick={() => setIsFlashOn(!isFlashOn)}
                disabled={isCapturingSeries}
                className={`px-1.5 md:px-3 py-1 md:py-1.5 rounded-full text-[8.5px] md:text-xs font-bold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-0.5 md:gap-1 border border-white/40 backdrop-blur-md shrink-0 ${
                  isCapturingSeries ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isFlashOn 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-black/50 text-gray-200 hover:bg-black/80'
                }`}
              >
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L6.5 13H12L11 22L18.5 11H13L14 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  <span className="inline md:hidden">FLASH</span>
                  <span className="hidden md:inline">FLASH: {isFlashOn ? 'ON' : 'OFF'}</span>
                </span>
              </button>

              {/* LIVE */}
              <button 
                type="button"
                onClick={() => setIsLive(!isLive)}
                className={`px-1.5 md:px-3 py-1 md:py-1.5 rounded-full text-[8.5px] md:text-xs font-bold uppercase tracking-tight transition-all cursor-pointer flex items-center gap-0.5 md:gap-1 border border-white/40 backdrop-blur-md shrink-0 ${
                  isLive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-black/50 text-gray-200 hover:bg-black/80'
                }`}
              >
                <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                  <circle cx="12" cy="12" r="4" fill="currentColor"/>
                </svg>
                <span>LIVE</span>
              </button>

            </div>

            {/* Tombol Shutter */}
            <div className="w-full flex justify-center pb-1 z-10">
              <button 
                type="button"
                onClick={handleCaptureClick}
                disabled={isCapturingSeries} 
                className={`w-12 h-12 md:w-16 md:h-16 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-transform active:scale-95 shadow-xl cursor-pointer ${
                  isCapturingSeries ? 'opacity-40 cursor-not-allowed scale-90' : ''
                }`}
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* ================= SISI KANAN: PANEL PREVIEW FOTO ================= */}
        <div className="md:col-span-5 w-full md:h-full bg-white border border-gray-200 rounded-3xl p-4 md:p-5 flex flex-col justify-between shadow-xs">
          
          {/* Header Title */}
          <div className="flex items-center justify-between mb-2 border-b border-gray-100 pb-2">
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Photos</h2>
            <span className="text-xs font-bold text-gray-500">{takenPhotosCount}/6</span>
          </div>

          {/* Container Slot Foto */}
          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100 flex-1 flex flex-col justify-center my-2 overflow-hidden">
            <div className="grid grid-cols-2 gap-2.5 w-full md:grid-rows-3 md:h-full">
              {photos.map((photo, index) => (
                <div 
                  key={index}
                  className="w-full aspect-[4/3] md:aspect-auto md:h-full bg-slate-200/70 rounded-xl relative overflow-hidden border border-gray-200/60 flex items-center justify-center shadow-2xs"
                >
                  {photo ? (
                    <>
                      <img 
                        src={photo} 
                        alt={`Hasil ${index + 1}`} 
                        className="w-full h-full object-cover absolute inset-0" 
                      />
                      <button 
                        type="button"
                        onClick={() => handleRetake(index)}
                        disabled={isCapturingSeries}
                        className={`absolute bottom-1.5 left-1.5 w-6 h-6 bg-white text-gray-950 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow border border-gray-200 z-10 ${
                          isCapturingSeries ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Retake foto ini"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <polyline points="3 3 3 8 8 8" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                      <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-semibold text-slate-400">Slot {index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons (Reset & Continue) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button 
              type="button"
              onClick={handleResetPhotos}
              disabled={takenPhotosCount === 0 || isCapturingSeries}
              className={`w-full font-bold py-2.5 rounded-xl border-2 text-xs transition-colors ${
                takenPhotosCount === 0 || isCapturingSeries
                  ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                  : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer'
              }`}
            >
              Reset
            </button>

            <button 
              type="button"
              onClick={handleContinueToEdit}
              disabled={!isPhotosComplete || isCapturingSeries}
              className={`w-full font-bold py-2.5 rounded-xl text-xs block text-center tracking-wide transition-all ${
                !isPhotosComplete || isCapturingSeries
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm'
              }`}
            >
              Continue to edit
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}