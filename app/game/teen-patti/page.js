'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, LayoutDashboard } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {Users} from 'lucide-react';
const suits = ['hakam', 'chokat', 'dil', 'fuli'];

function TeenPattiPageContent() {
  const [cards, setCards] = useState([]);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const username = searchParams.get('username');
  const rawProfileImageURL = searchParams.get('profileImageURL');
  const profileImageURL = rawProfileImageURL ? decodeURIComponent(rawProfileImageURL) : '';

  console.log('Received ID:', id);
  console.log('Received Username:', username);
  console.log('Received Profile Image URL:', profileImageURL);

  useEffect(() => {
    const screenW = window.innerWidth;

    const generated = Array.from({ length: 20 }).map((_, index) => {
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const number = Math.floor(Math.random() * 13) + 1;

      const direction = Math.random() < 0.5 ? 'left' : 'right';
      const startX = direction === 'left' ? -screenW - 100 : screenW + 100;
      const endX = direction === 'left' ? screenW + 100 : -screenW - 100;

      const top = `${Math.random() * 100}vh`;
      const rotation = Math.random() * 360;
      const duration = 20 + Math.random() * 20;
      const delay = Math.random() * 5;

      return {
        suit,
        number,
        startX,
        endX,
        top,
        rotation,
        duration,
        delay,
        key: index,
      };
    });

    setCards(generated);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] via-[#141414] to-[#0e0e0e] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Floating Cards */}
      {cards.map((card) => (
        <motion.div
          key={card.key}
          className="absolute z-0"
          initial={{ x: card.startX, rotate: 0 }}
          animate={{ x: card.endX, rotate: card.rotation }}
          transition={{
            duration: card.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: card.delay,
          }}
          style={{ top: card.top }}
        >
          <Image
            src={`/cards/${card.suit}-${card.number}.png`}
            alt={`${card.suit}-${card.number}`}
            width={64}
            height={96}
            className="opacity-10 pointer-events-none"
          />
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-[#1e1e2e] p-10 rounded-3xl shadow-2xl border border-yellow-500 text-center z-10 max-w-xl w-full"
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 15, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
        >
          <Crown className="w-14 h-14 text-yellow-400 animate-pulse" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-wide">
          Teen Patti Awaits!
        </h1>

        <p className="text-lg text-gray-400 mb-6">
          A thrilling 3-card game loved across India. Play with strategy, bluff, and luck!
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            href="/dashboard"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-md hover:shadow-yellow-400/40"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            href={{
              pathname: '/game/teen-patti/game-table',
              query: {
                id,
                username,
                profileImageURL: encodeURIComponent(profileImageURL),
                isPrivate: false,
              },
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-md hover:shadow-green-500/40"
          >
            🎮 Play Game
          </Link>

          <Link
            href={{
              pathname: '/game/teen-patti/game-table',
              query: {
                id,
                username,
                profileImageURL: encodeURIComponent(profileImageURL),
                isPrivate: true,
              },
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-md hover:shadow-purple-500/40"
          >
            <Users className="w-5 h-5" />
            Private Room
          </Link>

        </div>

      </motion.div>

      {/* Bottom Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-yellow-600 to-transparent"
      />
    </div>
  );
}

export default function TeenPattiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] via-[#141414] to-[#0e0e0e] text-white flex flex-col items-center justify-center px-6">
        <div className="text-white text-center">Loading...</div>
      </div>
    }>
      <TeenPattiPageContent />
    </Suspense>
  );
}
