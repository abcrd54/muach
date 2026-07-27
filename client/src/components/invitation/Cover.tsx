import { motion } from 'motion/react';
import { Guest } from '../../utils/api';

interface CoverProps {
  guest: Guest;
  onOpen: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Cover({ guest, onOpen }: CoverProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-spotify-bg">
        <div className="absolute inset-0">
          <img
            src="/assets/images/cover.JPG"
            alt=""
            className="w-full h-full object-cover blur-sm opacity-40 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-spotify-bg/60 via-spotify-bg/40 to-spotify-bg/80" />
        </div>

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-10 w-80 h-80 bg-spotify-green/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-spotify-green/5 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-spotify-green/5 rounded-full blur-[80px]"
      />

      <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 text-center">
        <motion.div variants={item} className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-spotify-green/10 rounded-full blur-2xl" />
          <motion.svg
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="relative w-16 h-16 mx-auto"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path className="text-spotify-green" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
        </motion.div>

        <motion.div variants={item} className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-spotify-green/40" />
          <span className="text-spotify-green/60 text-xs tracking-[0.4em] uppercase font-medium">
            Wedding Invitation
          </span>
          <div className="w-8 h-[1px] bg-spotify-green/40" />
        </motion.div>

        <motion.p variants={item} className="text-spotify-text text-base font-light tracking-[0.15em] mb-2">
          Kepada Yth.
        </motion.p>

        <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold text-spotify-white mb-3 text-glow">
          {guest.name}
        </motion.h1>

        <motion.div variants={item} className="flex items-center justify-center gap-3 mb-10">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 bg-spotify-green/20 rounded-full animate-ping" />
            <div className="relative w-full h-full bg-spotify-green/40 rounded-full" />
          </div>
          <p className="text-xl md:text-2xl text-spotify-green font-medium">
            {guest.address}
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="relative inline-block"
        >
          <div className="absolute -inset-1 bg-spotify-green/20 rounded-full blur-md animate-pulse-green" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="relative btn-spotify text-lg px-14 py-4"
          >
            Buka Undangan
          </motion.button>
        </motion.div>

        <motion.div variants={item} className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="ornament-diamond" />
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-spotify-green/30" />
            <div className="ornament-diamond" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-spotify-green/30" />
            <div className="ornament-diamond" />
          </div>
          <p className="text-spotify-text-secondary text-sm italic">
            Mohon maaf apabila undangan ini disampaikan melalui media digital
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}