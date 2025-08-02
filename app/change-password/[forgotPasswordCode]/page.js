'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export default function ChangePasswordPage() {
  const { forgotPasswordCode } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Email regex for basic validation
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 6;
  };

  useEffect(() => {
    setEmailError(email && !validateEmail(email) ? 'Invalid email format' : '');
    setPasswordError(newPassword && !validatePassword(newPassword) ? 'Password must be at least 6 characters' : '');

    setIsFormValid(
      validateEmail(email) &&
      validatePassword(newPassword) &&
      forgotPasswordCode
    );
  }, [email, newPassword, forgotPasswordCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post('/api/users/change-password', {
        email,
        newPassword,
        forgotPasswordCode,
      });

      if (res.data.success) {
        toast.success('Password changed successfully!');
        router.push('/login');
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">
          Change Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/60 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/60 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 py-3 rounded-xl font-semibold text-white shadow-lg hover:brightness-110 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </main>
  );
}
