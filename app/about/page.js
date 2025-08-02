'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white px-6 py-12 font-sans overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
       
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-800/60 to-black/80 mix-blend-multiply" />
      </div>

      {/* Heading */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Cards Royale
      </motion.h1>

      {/* Intro Text */}
      <motion.p
        className="text-center text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        Cards Royale is a dynamic online platform where you can dive into a variety of classic Indian and international card games. Whether you are a fan of Teen Patti, Rummy, Mindi, or other strategy-packed games, Cards Royale is built for competitive fun and mental sharpness.
      </motion.p>

      {/* Game Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {[
          {
            title: 'Teen Patti',
            desc: 'A thrilling 3-card game loved across India. Play with strategy, bluff, and luck!',
            emoji: '🃏',
          },
          {
            title: 'Mindi',
            desc: 'Also known as “Dehla Pakad”, a strategic trick-taking game played in teams.',
            emoji: '🧠',
          },
          {
            title: 'Rummy',
            desc: 'Form sequences and sets with your cards before anyone else does.',
            emoji: '♠️',
          },
        ].map((game, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-xl border border-white/20 bg-white/10 text-center backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 0.5, duration: 0.8 }}
          >
            <div className="text-4xl mb-4">{game.emoji}</div>
            <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
            <p className="text-white/80">{game.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Credits */}
      <motion.div
        className="text-center text-lg text-white/70 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Developed by <span className="font-bold text-red-400">Kishan Solanki</span>
      </motion.div>

      {/* Back Button */}
      <div className="text-center">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-xl"
          >
            Back to Home
          </motion.button>
        </Link>
      </div>
    </main>
  );
}
