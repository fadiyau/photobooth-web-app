'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch('/api/users/profile');
        const data = await res.json();

        if (res.ok && data?.user) {
          setProfileData({
            name: data.user.name || '',
            username: data.user.username || '',
            email: data.user.email || ''
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          username: profileData.username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui profil');
      }

      setMessage({ type: 'success', text: data.message || 'Profile updated successfully!' });
      
      router.refresh();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-500 font-medium">Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-6 sm:px-12 lg:px-38 pt-24 md:pt-28 pb-12 sm:pb-16">
        
        <div className="max-w-5xl mx-auto">

          {/* PAGE TITLE */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Update your personal information and account setup
            </p>
          </div>

          {/* NOTIFICATION TOAST */}
          {message.text && (
            <div className={`mb-6 p-4 border text-sm rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* GRID CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* LEFT CARD: ACCOUNT INFO */}
            <div className="md:col-span-4 bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900 text-sm">Account Info</h2>
                <p className="text-xs text-gray-500">Your public profile details</p>
              </div>
              
              <div className="p-8 flex flex-col items-center text-center">
                
                {/* AVATAR INISIAL DARI USERNAME */}
                <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-2xl tracking-wider mb-4">
                  {profileData.username 
                    ? profileData.username.substring(0, 2).toUpperCase()
                    : 'U'}
                </div>

                {/* USER INFORMATION DISPLAY */}
                <h3 className="font-bold text-gray-900 text-base">
                  {profileData.name || 'Name Name Name'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  @{profileData.username || 'username'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {profileData.email}
                </p>
              </div>
            </div>

            {/* RIGHT CARD: EDIT PROFILE FORM */}
            <div className="md:col-span-8 bg-white rounded-xl border border-gray-300 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900 text-sm">Edit Profile</h2>
                <p className="text-xs text-gray-500">Update your personal information</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* NAME INPUT */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* USERNAME INPUT */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* EMAIL INPUT */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    readOnly
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-md bg-slate-100 text-xs text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    email cannot be changed
                  </p>
                </div>

                {/* SAVE BUTTON SECTION */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-semibold text-xs hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}