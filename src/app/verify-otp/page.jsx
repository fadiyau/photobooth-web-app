'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || ''; 
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Timer countdown untuk Resend Code
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Handle Input Digit OTP
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Otomatis pindah fokus ke input selanjutnya
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Jika 4 digit sudah terisi penuh, otomatis kirim / verifikasi
    const fullCode = newOtp.join('');
    if (fullCode.length === 4) {
      handleVerify(fullCode);
    }
  };

  // Handle tombol Backspace/Delete agar fokus mundur ke box sebelumnya
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle Paste langsung 4 digit angka
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs[3].current?.focus();
      handleVerify(pastedData);
    }
  };

  // Fungsi Verifikasi OTP ke Backend
  const handleVerify = async (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length !== 4) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (res.ok) {
        // Jika berhasil verifikasi, redirect ke login atau dashboard
        router.push('/login?verified=true');
      } else {
        setErrorMsg(data.message || 'Kode verifikasi salah atau kedaluwarsa.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Kirim Ulang OTP
  const handleResendCode = async () => {
    if (!canResend) return;

    setCanResend(false);
    setTimer(60); // Reset timer ke 60 detik
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setErrorMsg('Gagal mengirim ulang kode. Coba lagi nanti.');
      }
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white rounded-2xl p-8 sm:p-12 w-full max-w-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Confirm your email address
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-sm leading-relaxed">
          We have sent a verification code to your email{email ? ` (${email})` : ''}. Please enter it below to continue.
        </p>

        {/* Error Message jika ada */}
        {errorMsg && (
          <div className="mt-4 text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}

        {/* 4 Digit Input Boxes */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 my-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={loading}
              className="w-14 h-16 sm:w-16 sm:h-20 bg-gray-200/70 border border-transparent rounded-xl text-center text-2xl font-bold text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:opacity-50"
            />
          ))}
        </div>

        {/* Resend Code Info & Timer */}
        <div className="text-xs sm:text-sm text-gray-500 font-medium">
          {canResend ? (
            <button
              onClick={handleResendCode}
              type="button"
              className="text-blue-600 font-semibold hover:underline cursor-pointer focus:outline-none"
            >
              Resend code
            </button>
          ) : (
            <span>
              Code sent. You can resend the code in{' '}
              <span className="text-blue-600 font-semibold">{timer}s</span>.
            </span>
          )}
        </div>

        {/* Back to Login Link */}
        <div className="text-center pt-3">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              ← Back to Log In
            </button>
          </div>
      </div>
    </div>
  );
}