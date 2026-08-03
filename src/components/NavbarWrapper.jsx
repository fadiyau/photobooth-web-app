'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; 

export default function NavbarWrapper({ user, isLoggedIn }) {
  const pathname = usePathname();

  // Daftar route yang TIDAK ingin menampilkan Navbar
  const hideNavbarRoutes = [
    '/forgot-password',
    '/reset-password',
    '/login',
    '/signup',
    '/verify-otp'
  ];

  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar user={user} isLoggedIn={isLoggedIn} />;
}