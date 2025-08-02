'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import './Home.css';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false });

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/background_animation.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-purple-900/60 to-black/70 mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-[90vh] text-white px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold text-center drop-shadow-xl z-10 mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          Cards Royale
        </h1>

        <p className="text-xl md:text-2xl text-center max-w-3xl mb-10 leading-relaxed">
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
            Enter a battlefield where every move counts
          </span>
          <br />
          <span className="text-white/90 text-lg md:text-xl">
            Sharpen your mind, deploy your strategy, and rise through the ranks in thrilling real-time duels!
          </span>
        </p>

        <div className="flex gap-6">
          <Link href="/login">
            <MotionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-pink-500 to-red-500 transition-transform px-8 py-3 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl"
            >
              Start Playing
            </MotionButton>
          </Link>
          <Link href="/about">
            <MotionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gray-300 to-white text-black transition-transform px-8 py-3 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl"
            >
              Learn More
            </MotionButton>
          </Link>
        </div>
      </div>

      <MotionDiv
        className="relative z-10 px-6 py-12 bg-black/40 backdrop-blur-lg grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {[
          { emoji: '⚔️', title: 'Strategic Combat', desc: 'Master the art of tactical card battles with deep strategy mechanics.' },
          { emoji: '🏆', title: 'Competitive Ranking', desc: 'Climb the leaderboards and prove your skills against players worldwide.' },
          { emoji: '⚡', title: 'Real-time Duels', desc: 'Engage in fast-paced, real-time battles that test your quick thinking.' },
        ].map((item, idx) => (
          <div key={idx} className="p-6 rounded-xl border border-white/20 bg-white/10">
            <div className="text-4xl mb-4">{item.emoji}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </MotionDiv>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10">
          <Image
            src="/cards/hakam-1.png"
            alt="card"
            width={64}
            height={96}
            className="opacity-60 floating-card"
            loading="lazy"
          />
        </div>
        <div className="absolute top-1/2 right-10">
          <Image
            src="/cards/chokat-1.png"
            alt="card"
            width={80}
            height={120}
            className="opacity-60 floating-card"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
}
