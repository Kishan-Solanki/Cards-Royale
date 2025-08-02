'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import './Verifyemail.css';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');

  // Memoized validation functions
  const emailValidation = useMemo(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Enter a valid email address';
    }
    return '';
  }, [email]);

  const otpValidation = useMemo(() => {
    if (otp && !/^\d{6}$/.test(otp)) {
      return 'OTP must be 6 digits';
    }
    return '';
  }, [otp]);

  // Update errors only when validation results change
  useEffect(() => {
    setEmailError(emailValidation);
  }, [emailValidation]);

  useEffect(() => {
    setOtpError(otpValidation);
  }, [otpValidation]);

  // Memoized form validity check
  const isFormValid = useMemo(() => {
    return !emailError && !otpError && email && otp;
  }, [emailError, otpError, email, otp]);

  // Memoized event handlers
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleOtpChange = useCallback((e) => {
    const val = e.target.value.replace(/\D/g, '');
    setOtp(val);
  }, []);

  const handleVerify = useCallback(async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/users/verify-email', { email, otp });
      if (res.data.success) {
        toast.success('Email verified! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(res.data.message || 'Verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  }, [isFormValid, email, otp, router]);

  const handleResend = useCallback(async () => {
    if (!email) return toast.error('Enter email to resend code');
    if (emailError) return toast.error(emailError);

    try {
      await axios.post('/api/users/resend-code', { email });
      toast.success('Verification code resent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resending code');
    }
  }, [email, emailError]);

  // Memoized motion variants
  const containerVariants = useMemo(() => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7 }
  }), []);

  const buttonHoverVariants = useMemo(() => ({
    scale: 1.05
  }), []);

  const buttonTapVariants = useMemo(() => ({
    scale: 0.95
  }), []);

  // Memoized CSS classes
  const emailInputClasses = useMemo(() => {
    return `w-full px-4 py-2 rounded-lg bg-black/60 text-white border ${
      emailError ? 'border-red-500' : 'border-white/20'
    } focus:outline-none focus:ring-2 focus:ring-purple-500`;
  }, [emailError]);

  const otpInputClasses = useMemo(() => {
    return `w-full px-4 py-2 rounded-lg bg-black/60 text-white border ${
      otpError ? 'border-red-500' : 'border-white/20'
    } focus:outline-none focus:ring-2 focus:ring-purple-500`;
  }, [otpError]);

  const submitButtonClasses = useMemo(() => {
    const baseClasses = 'w-full bg-gradient-to-r from-green-400 to-emerald-500 py-3 rounded-xl font-semibold text-white shadow-lg hover:brightness-110';
    const disabledClasses = 'disabled:opacity-50';
    return `${baseClasses} ${disabledClasses}`;
  }, []);

  // Memoized button disabled state
  const isButtonDisabled = useMemo(() => {
    return loading || !isFormValid;
  }, [loading, isFormValid]);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black/90 text-white px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <motion.div
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
        {...containerVariants}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">Verify Your Email</h1>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              className={emailInputClasses}
              autoComplete="email"
            />
            {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">OTP</label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={handleOtpChange}
              className={otpInputClasses}
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="\d{6}"
            />
            {otpError && <p className="text-red-400 text-sm mt-1">{otpError}</p>}
          </div>

          <motion.button
            type="submit"
            whileHover={!isButtonDisabled ? buttonHoverVariants : {}}
            whileTap={!isButtonDisabled ? buttonTapVariants : {}}
            disabled={isButtonDisabled}
            className={submitButtonClasses}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </motion.button>
        </form>

        <button
          onClick={handleResend}
          className="text-center text-sm text-blue-400 hover:underline mt-4 block mx-auto"
          type="button"
        >
          Resend Code
        </button>

        <p className="text-center text-sm text-white/70 mt-6">
          Already verified?{' '}
          <Link href="/login" className="text-pink-400 hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </main>
  );
}