'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import './Forgot-password.css';
import axios from 'axios';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!isValidEmail) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('/api/users/send-resetPasswordLink', { email });

      if (response.status === 200) {
        toast.success('Reset link successfully sent!');
        setSubmitted(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Email not found');
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black/90 text-white px-4">
      <div className="absolute inset-0 -z-10 bg-black/70" />

      <motion.div
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1
          className="text-3xl font-bold mb-6 text-center text-gradient"
          style={{ willChange: 'transform, opacity' }}
        >
          Forgot Password
        </h1>

        {!submitted ? (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg bg-black/60 text-white border 
                  ${email.length === 0
                    ? 'border-white/20'
                    : isValidEmail
                    ? 'border-green-500'
                    : 'border-red-500'}
                  focus:outline-none focus:ring-2 focus:ring-pink-500`}
                required
              />
              {!isValidEmail && email.length > 0 && (
                <p className="text-sm text-red-400 mt-1">Please enter a valid email address.</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={!isValidEmail || isLoading}
              whileHover={{ scale: !isValidEmail || isLoading ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all
                ${!isValidEmail || isLoading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-red-500 hover:brightness-110'}
              `}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
          </form>
        ) : (
          <motion.div
            className="text-center space-y-4"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-green-400">Email Sent!</h2>
            <p className="text-white/70">
              We sent a password reset link to <strong>{email}</strong>. Please check your inbox.
            </p>
          </motion.div>
        )}

        <p className="text-center text-sm text-white/70 mt-6">
          Back to{' '}
          <Link href="/login" className="text-pink-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
