'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [showConfirmSection, setShowConfirmSection] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState(null);

  useEffect(() => {
    if (searchParams.get('forceLogout') === 'true') {
      toast.warning('Invalid session. Please login again.');
    }
  }, [searchParams]);

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  useEffect(() => {
    const emailValid = /^\S+@\S+\.\S+$/.test(email);
    const passwordValid = password.length >= 6;
    setIsFormValid(emailValid && passwordValid);
  }, [email, password]);

  const login = async ({ email, password, forceLogout }) => {
    setLoading(true);
    setCooldown(true);
    
    try {
      const res = await axios.post('/api/users/sign-in', {
        email,
        password,
        forceLogout,
      });

      // Handle the case where force logout is required
      if (res.data.requireForceLogout) {
        setPendingCredentials({ email, password });
        setShowConfirmSection(true);
        setLoading(false);
        setCooldown(false);
        return;
      }

      // Handle successful login
      if (res.data.success) {
        toast.success(res.data.message || 'Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      // Handle different error scenarios
      if (err.response?.status === 403 && err.response?.data?.requireForceLogout) {
        setPendingCredentials({ email, password });
        setShowConfirmSection(true);
      } else {
        const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Something went wrong';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      // Reset cooldown after 3 seconds
      setTimeout(() => setCooldown(false), 3000);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isFormValid || loading || cooldown) return;
    login({ email, password, forceLogout: false });
  };

  const handleForceLogin = () => {
    if (!pendingCredentials || loading) return;
    login({ ...pendingCredentials, forceLogout: true });
    setShowConfirmSection(false);
    setPendingCredentials(null);
  };

  const handleCancel = () => {
    setShowConfirmSection(false);
    setPendingCredentials(null);
    setLoading(false);
    setCooldown(false);
    toast.info('Login cancelled.');
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black/90 text-white px-4">
      <div className="absolute inset-0 -z-10 bg-black/70" />

      <motion.div
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Login to Cards Royale
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg bg-black/60 text-white border ${
                email && !/^\S+@\S+\.\S+$/.test(email)
                  ? 'border-red-500'
                  : 'border-white/20'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg bg-black/60 text-white border ${
                  password && password.length < 6
                    ? 'border-red-500'
                    : 'border-white/20'
                } focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 disabled:opacity-50`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white/80 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Link
              href="/forgot-password"
              className="text-xs text-pink-400 hover:underline mt-1 inline-block"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: isFormValid && !loading && !cooldown ? 1.05 : 1 }}
            whileTap={{ scale: isFormValid && !loading && !cooldown ? 0.95 : 1 }}
            disabled={!isFormValid || loading || cooldown}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 py-3 rounded-xl font-semibold text-white shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Logging in...
              </>
            ) : cooldown ? (
              'Please wait...'
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-pink-400 hover:underline">
            Register here
          </Link>
        </p>

        {/* Confirmation Section for Force Logout */}
        {showConfirmSection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 border-t border-white/20 pt-6"
          >
            <h2 className="text-lg font-semibold text-yellow-400 mb-2 text-center">
              Already Logged In
            </h2>
            <p className="text-sm text-white/80 text-center mb-6">
              You are already logged in on another device. Do you want to logout from there and continue here?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors text-sm font-medium"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors text-sm font-medium flex items-center gap-2"
                onClick={handleForceLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  'Yes, Continue'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen flex items-center justify-center bg-black/90 text-white px-4">
        <div className="text-white text-center">Loading...</div>
      </main>
    }>
      <LoginPageContent />
    </Suspense>
  );
}