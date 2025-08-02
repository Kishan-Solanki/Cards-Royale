'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import './Register.css';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // To manage 5 sec disable timer
  const disableTimeoutRef = useRef(null);
  const [disabledTimeoutActive, setDisabledTimeoutActive] = useState(false);

  // Memoized validation logic to prevent unnecessary re-renders
  const validationErrors = useMemo(() => {
    const newErrors = {};

    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (
      formData.confirmPassword &&
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  }, [formData.username, formData.email, formData.password, formData.confirmPassword]);

  // Memoized form validity check
  const formIsValid = useMemo(() => {
    const noErrors = Object.keys(validationErrors).length === 0;
    const allFilled =
      formData.username.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '';
    return noErrors && allFilled;
  }, [validationErrors, formData.username, formData.email, formData.password, formData.confirmPassword]);

  // Update errors and validity only when needed
  useEffect(() => {
    setErrors(validationErrors);
    setIsValid(formIsValid);
  }, [validationErrors, formIsValid]);

  useEffect(() => {
    return () => {
      if (disableTimeoutRef.current) {
        clearTimeout(disableTimeoutRef.current);
      }
    };
  }, []);

  // Memoized event handlers to prevent re-renders
  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files.length > 0) {
      setFormData(prev => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmVisibility = useCallback(() => {
    setShowConfirm(prev => !prev);
  }, []);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();

    if (!isValid || loading || disabledTimeoutActive) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setLoading(true);
    setDisabledTimeoutActive(true);

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('password', formData.password);

      if (formData.profileImage) {
        data.append('profileImage', formData.profileImage);
      }

      await axios.post('/api/users/sign-up', data);

      toast.success('Registration successful!');
      router.push('/verifyemail');
    } catch (error) {
      const message = error?.response?.data?.error || 'Something went wrong';

      if (message === 'User already exists') {
        toast.error('User with this email already exists');
      } else if (message === 'Username already taken') {
        toast.error('Username is already taken');
      } else if (message === 'All fields are required') {
        toast.error('Please fill out all fields');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);

      // Disable button for 5 seconds after click to avoid spam
      disableTimeoutRef.current = setTimeout(() => {
        setDisabledTimeoutActive(false);
      }, 5000);
    }
  }, [isValid, loading, disabledTimeoutActive, formData, router]);

  // Memoized motion variants to prevent object recreation
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

  // Memoized button classes to prevent string concatenation on every render
  const buttonClasses = useMemo(() => {
    const baseClasses = 'w-full py-3 rounded-xl font-semibold text-white shadow-lg flex justify-center items-center gap-2';
    const enabledClasses = 'bg-gradient-to-r from-pink-500 to-red-500 hover:brightness-110';
    const disabledClasses = 'bg-gray-600 cursor-not-allowed';
    
    return `${baseClasses} ${
      isValid && !loading && !disabledTimeoutActive
        ? enabledClasses
        : disabledClasses
    }`;
  }, [isValid, loading, disabledTimeoutActive]);

  // Memoized input class generators
  const getInputClasses = useCallback((hasError) => {
    return `w-full px-4 py-2 rounded-lg bg-black/60 text-white border ${
      hasError ? 'border-red-500' : 'border-white/20'
    } focus:outline-none focus:ring-2 focus:ring-purple-500`;
  }, []);

  const getPasswordInputClasses = useCallback((hasError) => {
    return `w-full px-4 py-2 rounded-lg bg-black/60 text-white border ${
      hasError ? 'border-red-500' : 'border-white/20'
    } focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10`;
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black/90 text-white px-4">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <motion.div
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
        {...containerVariants}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">
          Create Your Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-5" noValidate>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={getInputClasses(errors.username)}
            />
            {errors.username && (
              <p className="text-xs text-red-400 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClasses(errors.email)}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={getPasswordInputClasses(errors.password)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-white/60"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={getPasswordInputClasses(errors.confirmPassword)}
              />
              <button
                type="button"
                onClick={toggleConfirmVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-white/60"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="text-sm file:bg-pink-600 file:text-white file:rounded-lg file:px-3 file:py-1 file:mr-3 file:border-none"
              />
              {formData.profileImage && (
                <p className="text-xs text-white/60 truncate w-32">
                  {formData.profileImage.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={!loading && !disabledTimeoutActive ? buttonHoverVariants : {}}
            whileTap={!loading && !disabledTimeoutActive ? buttonTapVariants : {}}
            className={buttonClasses}
            disabled={!isValid || loading || disabledTimeoutActive}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-pink-400 hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </main>
  );
}