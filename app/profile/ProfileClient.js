'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Wallet2,
  LogOut,
  Play,
  DollarSign,
  Pencil,
  LayoutDashboard
} from 'lucide-react';

import EditProfileSection from './EditProfileSection';

export default function ProfileClient({ user }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-10">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Image
            src={user?.profileImageURL || '/default-avatar.png'}
            alt="Profile"
            width={64}
            height={64}
            className="rounded-full border-2 border-purple-500"
          />
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.username || 'Champion'}
            </h1>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              {user?.email}
              {user?.isVerified ? (
                <span className="text-green-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Verified
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  Unverified
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Game Wallet */}
        <div className="bg-[#1f1f2e] p-6 rounded-2xl shadow-lg flex items-center gap-4 mb-6">
          <Wallet2 className="w-8 h-8 text-yellow-400" />
          <div>
            <p className="text-sm text-gray-400">Game Wallet</p>
            <p className="text-2xl font-semibold text-yellow-300">
              🪙 {user?.gameMoney?.toLocaleString('en-US') || '0'}
            </p>

          </div>
        </div>

        {/* User Info */}
        <div className="bg-[#1c1c2b] p-6 rounded-2xl grid gap-3 mb-6">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p>
            <strong>Status:</strong>{' '}
            {user?.isVerified ? (
              <span className="text-green-400">Verified</span>
            ) : (
              <span className="text-red-400">Unverified</span>
            )}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            href="/dashboard"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <button className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-full text-black font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Buy Tokens
          </button>

          <form action="/api/users/logout" method="GET">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>

        {/* Toggle Edit Profile */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowEdit((prev) => !prev)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            {showEdit ? 'Close Edit Section' : 'Edit Profile'}
          </button>
        </div>

        {/* Edit Profile Section */}
        {showEdit && <EditProfileSection user={user} />}
      </div>
    </>
  );
}
