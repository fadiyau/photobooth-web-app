'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer'; 

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    name: 'Name Name Name',
    username: 'username',
    email: 'username@gmail.com'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: value })); // atau setProfileData
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile Data:", profileData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* NAVBAR KOMPONEN */}
      <Navbar />

      {/* MAIN CONTENT DENGAN POLA LEBAR RESPONSIF SEPERTI HALAMAN LAIN */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-6 sm:px-12 lg:px-38 pt-24 md:pt-28 pb-12 sm:pb-16">
        
        {/* CONTAINER KONTEN AGAR BERADA DI TENGAH DAN PROPORSIONAL */}
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
          {isSaved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
              Profile updated successfully!
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
                {/* AVATAR PLACEHOLDER */}
               <div className="w-28 h-28 rounded-full bg-slate-300/80 flex items-center justify-center text-slate-600 mb-4 overflow-hidden relative">
                <svg className="w-20 h-20 translate-y-2 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
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
                    placeholder="Name Name Name"
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
                    placeholder="username"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                {/* EMAIL INPUT (READ ONLY / DISABLED) */}
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
                    className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md font-semibold text-xs hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Changes
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER KOMPONEN */}
      <Footer />

    </div>
  );
}