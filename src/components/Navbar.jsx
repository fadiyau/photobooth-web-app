'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Data Navigasi terpusat
const NAV_LINKS = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-125 md:scale-[1.35] transform">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.867 15.8321L18.873 10.0391L14.75 5.92908C13.5057 4.69031 11.4942 4.69031 10.25 5.92908L6.13599 10.0291V15.8291C6.1393 17.5833 7.56377 19.0028 9.31799 19.0001H15.685C17.438 19.0029 18.862 17.5851 18.867 15.8321Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.624 6.01807C19.624 5.60385 19.2882 5.26807 18.874 5.26807C18.4598 5.26807 18.124 5.60385 18.124 6.01807H19.624ZM18.874 10.0391H18.124C18.124 10.2384 18.2033 10.4295 18.3445 10.5702L18.874 10.0391ZM19.9705 12.1912C20.2638 12.4837 20.7387 12.4829 21.0311 12.1896C21.3236 11.8962 21.3229 11.4214 21.0295 11.1289L19.9705 12.1912ZM6.66552 10.5602C6.95886 10.2678 6.95959 9.79289 6.66714 9.49955C6.3747 9.20621 5.89982 9.20548 5.60648 9.49793L6.66552 10.5602ZM3.97048 11.1289C3.67714 11.4214 3.67641 11.8962 3.96886 12.1896C4.2613 12.4837 4.73618 12.4837 5.02952 12.1912L3.97048 11.1289ZM13.75 19.0001C13.75 19.4143 14.0858 19.7501 14.5 19.7501C14.9142 19.7501 15.25 19.4143 15.25 19.0001H13.75ZM9.75 19.0001C9.75 19.4143 10.0858 19.7501 10.5 19.7501C10.9142 19.7501 11.25 19.4143 11.25 19.0001H9.75ZM18.124 6.01807V10.0391H19.624V6.01807H18.124ZM18.3445 10.5702L19.9705 12.1912L21.0295 11.1289L19.4035 9.50792L18.3445 10.5702ZM5.60648 9.49793L3.97048 11.1289L5.02952 12.1912L6.66552 10.5602L5.60648 9.49793ZM15.25 19.0001V17.2201H13.75V19.0001H15.25ZM15.25 17.2201C15.25 15.7013 14.0188 14.4701 12.5 14.4701V15.9701C13.1904 15.9701 13.75 16.5297 13.75 17.2201H15.25ZM12.5 14.4701C10.9812 14.4701 9.75 15.7013 9.75 17.2201H11.25C11.25 16.5297 11.8096 15.9701 12.5 15.9701V14.4701ZM9.75 17.2201V19.0001H11.25V17.2201H9.75Z" fill="currentColor"/>
      </svg>
    )
  },
  {
    label: 'Frames',
    href: '/frames',
    icon: (
      <svg viewBox="0 0 750 750" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-125 md:scale-[1.35] transform">
        <path d="M369.35 463.41c11.11 17.57 31.03 24.53 50.87 26.32 49.49 10.46 55.43-68.91 29.62-95.25 27.04-25.44 20.63-68.13-14.31-82.44-18.62-6.52-45.85-14.47-58.97 5.42-16.23-17.24-48.33-16.48-66-1.71-14.33 13.39-15.28 37.93-2.52 52.71-25.81 9.38-35.31 44.32-24.66 68.03 14.37 29.54 58.38 52.21 85.96 26.92Zm-34.5-79.4c11.92.49 13.72-20.08 3.53-24.11-42.14-14.25-9.66-35.28 18.21-26.17 10.62 1.8 14.43 25.92 26.58 11.26 3.12-.76 5.19-3.23 6.7-5.9 5.14-11.3 17.66-8.3 27.73-7.45 13.55 1.3 30.23 4.6 36.19 18.46 3.88 14.22-6.74 29.46-20.9 32.24-10.87-1.89-15.46 11.49-11.24 19.8 5.74 9.49 15.83 12.36 17.4 25.6-.92 11.26 3.23 32.62-12.11 34.67-35.43 1.31-31.47-4.7-50.52-28.66-11.94-10-20.04 8.47-31.56 9.02-18.72.23-43.77-7.57-50.41-26.68-2.7-25.1 19.55-32.19 40.4-32.09Z"/>
        <path d="M380.21 406.2c12.11 2.11 17.71-14.1 12.37-23.15-4.26-6.11-9.57-15.74-18-15.41-10.98-1.25-13.63 13.67-11.87 21.9,1.91,8.29,9.3 14.88 17.5 16.67Z"/>
        <path d="M584.3 452.84c1.73-43.49,7.34-86.84,5.87-130.42-1.63-27.48-6.32-54.88-11.87-81.83-5.8-19.58-13.47-57.21-36.13-62.64-27.86-4.41-55.06.83-82.17 6.84-7.45-19.12-16.15-41.64-37.11-48.71-46.46-10.85-113.94 1.78-105.95 62.93,.01,.13,.03,.26,.05,.39-13.08,1.06-26.21,1.51-39.25 3.07-11.41,1.63-22.44,5.21-33.75,7.35-16.87,2.78-33.45,7.05-50.22 10.34-12.22,.71-23.8,4.71-20.52 19.26-8.76,24.94-3.98,52-5.97,77.89-7.46,51.81-5.28,104.11-7.6,156.24-1.18,31.28,7.5,61.75,14.13,92.05,5.22,16.17,5.12,46.74,25,51.33,14.41,1.68,28.93-1.75,43.41-1.28,20.33,.02,40.73-.15,60.95-2.5,35.18-5.48,69.2-18.75,105.3-18.21,17.48-.7,34.75,2.53,52.1,4.12,21.42,2.27,42.96,2.44,64.45,3.62,16.82,.01,38.52,4.8,51.44-8.56,21.11-26.48,3.85-103.72,7.84-141.28ZM417.96,160.23c13.21,3.85,20.68,15.84,26.07,28.13-11.49,2.53-22.99,4.89-34.53,6.4-24.38,3.71-48.94,.31-73.36,2.59,.76-5.15,.46-10.45,1.86-15.5,12.6-25.25,55.58-27.13,79.96-21.61Zm-197.41,116.47c49.97-.32,100.2-1.93,149.8-8.78,47.44-4.55,95.3-5.11,142.42-12.74,5.1,28.35,2.83,57.19,3.15,85.83,.53,68.34,11.94,135.86,23.08,203.06-45.84-3.51-92.01-8.18-137.82-.97-24.75,2.47-48.49,10.66-72.99,14.39-30.9,5.25-62.12,6.83-93.42,6.64-1.69-.03-3.39,.03-5.08,.03-6.89-44.03-4.4-88.52-3.79-132.86,.01-51.53-1.7-103.39-5.35-154.6Zm350,216.58c-3.68,25.75,.07,53.37-9.38,77.92-26.16,5.49-53.49,3.25-80.09,5.38-28.18,2.21-56.42,3.14-84.68,2-36.44-3.09-72.93-1.43-109.18,2.72,10.03-2.41,20.07-4.78,30.16-6.54,31.41-5.35,63.42-4.79,95.16-6.69,34.47,.67,68.93,2.08,103.42,.72,12.81-.19,31.46,1.1,36.37-13.86,2.14-21.72-8.28-43.51-9.48-65.4-2.83-26.39,.38-52.91,.85-79.33,.17-38.47-5.86-76.55-8.25-114.88,.05-15.99,1.8-32.13-.01-48.06-.72-13.92-11.35-28.07-26.49-22.44-20.33,3.14-40.03,9.08-60.06,13.61-23.59,5.5-47.65,8.87-71.89,9.41-30.62,.73-61.23,1.72-91.85,2-18.9,.15-37.84-.87-56.73,.28-13.86-1.81-24.42,10.29-16.14,22.69-7.63,5.74-3.05,17.48-4.41,25.76-.58,8.76-1.58,17.49-1.85,26.26-1.87,51.11-3.86,102.31-1.25,153.43,4.83,28.08-14,99.65,16.53,112.9-1.43,.25-2.86,.51-4.29,.76-4.66,.2-9.47,.54-13.98-.87-5.66-21.8-7.41-44.48-13.73-66.16-8.61-26.06-15.13-52.79-14.37-80.45,.75-40.16,6.68-80.17,11.03-120.08,3.51-26.07-.55-52.62,6.29-78.25,40.55-9.63,81.06-12.56,122.6-17.28,45.28-8.59,90.39-19.92,136.44-23.19,29.69-1.11,59.68-2.12,89.21,1.68,26.15,32.14,25.35,77.82,25.78,117.48-2.04,56.28,10.01,112.3,4.27,168.5Z"/>
      </svg>
    )
  },
  {
    label: 'Gallery',
    href: '/gallery',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M22 13.4375C22 17.2087 22 19.0944 20.8284 20.2659C19.6569 21.4375 17.7712 21.4375 14 21.4375H10C6.22876 21.4375 4.34315 21.4375 3.17157 20.2659C2 19.0944 2 17.2087 2 13.4375C2 9.66626 2 7.78065 3.17157 6.60907C4.34315 5.4375 6.22876 5.4375 10 5.4375H14C17.7712 5.4375 19.6569 5.4375 20.8284 6.60907C21.4921 7.27271 21.7798 8.16545 21.9045 9.50024" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3.98779 6C4.10022 5.06898 4.33494 4.42559 4.82498 3.93726C5.76553 3 7.27932 3 10.3069 3H13.5181C16.5457 3 18.0595 3 19 3.93726C19.4901 4.42559 19.7248 5.06898 19.8372 6" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17.5" cy="9.9375" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 13.9376L3.75159 12.405C4.66286 11.6077 6.03628 11.6534 6.89249 12.5096L11.1822 16.7993C11.8694 17.4866 12.9512 17.5803 13.7464 17.0214L14.0446 16.8119C15.1888 16.0077 16.7369 16.1009 17.7765 17.0365L21 19.9376" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
];

function Navbar({ user: initialUser, isLoggedIn: initialIsLoggedIn }) {
  const [user, setUser] = useState(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Sinkronisasi state internal dari props jika props berubah dari Server Component (layout.js)
  useEffect(() => {
    setUser(initialUser);
    setIsLoggedIn(initialIsLoggedIn);
  }, [initialUser, initialIsLoggedIn]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
      router.push('/login');
      router.refresh();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const getDesktopNavLinkClass = (path) => {
    const isActive = pathname === path;
    return `flex items-center gap-2 px-4 h-full text-sm lg:text-base font-semibold transition-colors cursor-pointer border-b-2 ${
      isActive
        ? 'border-slate-900 text-slate-900'
        : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
    }`;
  };

  const getMobileNavLinkClass = (path) => {
    const isActive = pathname === path;
    return `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
      isActive
        ? 'bg-slate-100 text-slate-950'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-white text-gray-700 shadow-sm">
        <div className="relative mx-auto flex h-16 md:h-16 2xl:h-20 items-center justify-between px-6 sm:px-10 lg:px-16 max-w-[1800px]">
          
          {/* Logo */}
          <Link href="/" className="flex items-center justify-start gap-1.5 md:gap-2 font-semibold text-base sm:text-lg md:text-xl lg:text-lg 2xl:text-2xl text-slate-800 shrink-0 z-10">
            <div className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center border-2 border-slate-700 rounded-sm shrink-0">
              <span className="text-[10px] md:text-xs font-bold text-slate-700">✕</span>
            </div>
            <span className="tracking-tight truncate">OnlinePhotobooth</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-2 lg:gap-4 h-full">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={getDesktopNavLinkClass(link.href)}>
                <div className="w-5 h-5 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 flex items-center justify-center shrink-0">
                  {link.icon}
                </div>
                <span className="text-sm lg:text-base 2xl:text-lg">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions Kanan */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0 z-10">
            {isLoggedIn ? (
              <div className="flex items-center gap-2 md:gap-4">
                {/* Desktop User Profile Dropdown */}
                <div 
                  className="relative hidden md:block" 
                  ref={dropdownRef}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex h-9 w-9 md:h-10 md:w-10 lg:h-10 lg:w-10 2xl:h-12 2xl:w-12 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 shrink-0 font-bold uppercase text-xs">
                      {user?.username?.slice(0, 2) || user?.name?.slice(0, 2) || 'US'}
                    </div>
                    <span className="lg:text-md 2xl:text-lg font-semibold text-slate-800">
                      {user?.username || user?.name || 'User'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full pt-1.5 w-48 z-50">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-md py-1.5 overflow-hidden">
                        <Link 
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 2xl:text-md lg:text-sm font-semibold text-gray-700 hover:bg-slate-50 transition-colors"
                        >
                          <svg className="2xl:w-6 2xl:h-6 lg:w-4 lg:h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 2xl:text-md lg:text-sm  font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                        >
                          <svg className="2xl:w-6 2xl:h-6 lg:w-4 lg:h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Trigger (Logged In) */}
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="block md:hidden cursor-pointer hover:opacity-80 transition-opacity p-1"
                  aria-label="Open Menu"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 7H11C11.2652 7 11.5196 7.10536 11.7071 7.29289C11.8946 7.48043 12 7.73478 12 8C12 8.26522 11.8946 8.51957 11.7071 8.70711C11.5196 8.89464 11.2652 9 11 9H6C5.73478 9 5.48043 8.89464 5.29289 8.70711C5.10536 8.51957 5 8.26522 5 8C5 7.73478 5.10536 7.48043 5.29289 7.29289C5.48043 7.10536 5.73478 7 6 7V7ZM13 15H18C18.2652 15 18.5196 15.1054 18.7071 18.7071C18.8946 15.4804 19 15.7348 19 16C19 16.2652 18.8946 16.5196 18.7071 16.7071C18.5196 16.8946 18.2652 17 18 17H13C12.7348 17 12.4804 16.8946 12.2929 16.7071C12.1054 16.5196 12 16.2652 12 16C12 15.7348 12.1054 15.4804 12.2929 15.2929C12.4804 15.1054 12.7348 15 13 15ZM6 11H18C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13H6C5.73478 13 5.48043 12.8946 5.29289 12.7071C5.10536 12.5196 5 12.2652 5 12C5 11.7348 5.10536 11.4804 5.29289 11.2929C5.48043 11.1054 5.73478 11 6 11Z" fill="#001D6C"/>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Buttons (Logged Out) */}
                <div className="hidden md:flex items-center gap-3">
                  <Link 
                    href="/login" 
                    className="rounded-md border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all cursor-pointer shrink-0"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    Sign Up
                  </Link>
                </div>

                {/* Mobile Menu Trigger (Logged Out) */}
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="block md:hidden cursor-pointer hover:opacity-80 transition-opacity p-1"
                  aria-label="Open Menu"
                >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 7H11C11.2652 7 11.5196 7.10536 11.7071 7.29289C11.8946 7.48043 12 7.73478 12 8C12 8.26522 11.8946 8.51957 11.7071 8.70711C11.5196 8.89464 11.2652 9 11 9H6C5.73478 9 5.48043 8.89464 5.29289 8.70711C5.10536 8.51957 5 8.26522 5 8C5 7.73478 5.10536 7.48043 5.29289 7.29289C5.48043 7.10536 5.73478 7 6 7V7ZM13 15H18C18.2652 15 18.5196 15.1054 18.7071 18.7071C18.8946 15.4804 19 15.7348 19 16C19 16.2652 18.8946 16.5196 18.7071 16.7071C18.5196 16.8946 18.2652 17 18 17H13C12.7348 17 12.4804 16.8946 12.2929 16.7071C12.1054 16.5196 12 16.2652 12 16C12 15.7348 12.1054 15.4804 12.2929 15.2929C12.4804 15.1054 12.7348 15 13 15ZM6 11H18C18.2652 11 18.5196 11.1054 18.7071 11.2929C18.8946 11.4804 19 11.7348 19 12C19 12.2652 18.8946 12.5196 18.7071 12.7071C18.5196 12.8946 18.2652 13 18 13H6C5.73478 13 5.48043 12.8946 5.29289 12.7071C5.10536 12.5196 5 12.2652 5 12C5 11.7348 5.10536 11.4804 5.29289 11.2929C5.48043 11.1054 5.73478 11 6 11Z" fill="#001D6C"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop Mobile */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer Sidebar Mobile */}
      <aside 
        className={`fixed right-0 top-0 z-50 h-full w-[280px] sm:w-[320px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-5 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 ">
          <div className="flex items-center gap-2 font-semibold text-base lg:text-lg 2xl:text-2xl text-slate-800">
            <div className="flex h-5 w-5 items-center justify-center border-2 border-slate-700 rounded-sm">
              <span className="text-[10px] font-bold text-slate-700">✕</span>
            </div>
            <span className="tracking-tight">OnlinePhotobooth</span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
            aria-label="Close Menu"
          >
            ✕
          </button>
        </div>

        {/* Mobile Header Profile saat Logged In */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 pb-4 mb-2 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 shrink-0 font-bold uppercase text-xs">
              {user?.username?.slice(0, 2) || user?.name?.slice(0, 2) || 'US'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">{user?.username || user?.name || 'User'}</span>
              <span className="text-xs text-gray-400 truncate">{user?.email || ''}</span>
            </div>
          </div>
        )}

        {/* Mobile Menu List */}
        <div className="flex-1 space-y-2 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsMenuOpen(false)} 
              className={getMobileNavLinkClass(link.href)}
            >
              <div className="flex items-center justify-center w-5 h-5 shrink-0">
                {link.icon}
              </div>
              <span>{link.label}</span>
            </Link>
          ))}

          {isLoggedIn && (
            <Link 
              href="/settings"
              onClick={() => setIsMenuOpen(false)}
              className={getMobileNavLinkClass('/settings')}
            >
              <div className="flex items-center justify-center w-5 h-5 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span>Settings</span>
            </Link>
          )}
        </div>

        {/* Footer Sidebar Mobile */}
        <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
          {!isLoggedIn ? (
            <>
              <Link 
                href="/login"
                className="block text-center w-full py-2.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              
              <Link 
                href="/signup"
                className="block text-center w-full py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button 
              className="w-full py-2.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all cursor-pointer"
              onClick={handleLogout}
            >
              Log Out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;