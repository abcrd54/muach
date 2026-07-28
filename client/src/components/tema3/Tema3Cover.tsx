import { motion } from 'motion/react';
import { Guest } from '../../utils/api';
import Decoration from './Decoration';

interface Tema3CoverProps {
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

export default function Tema3Cover({ guest, onOpen }: Tema3CoverProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/assets/images/cover.JPG"
          alt=""
          className="w-full h-full object-cover blur-[2px] scale-110"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <Decoration type="ornament-corner" size={64} className="absolute top-6 left-6 z-10" opacity={0.5} animated />
      <Decoration type="ornament-corner" size={64} className="absolute top-6 right-6 z-10 scale-x-[-1]" opacity={0.5} animated />
      <Decoration type="ornament-corner" size={64} className="absolute bottom-6 left-6 z-10 scale-y-[-1]" opacity={0.5} animated />
      <Decoration type="ornament-corner" size={64} className="absolute bottom-6 right-6 z-10 scale-x-[-1] scale-y-[-1]" opacity={0.5} animated />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center text-white"
      >
        <motion.div
          variants={item}
          className="mb-6"
        >
          <motion.img
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            src="/assets/images/tema3/wedding.svg"
            alt=""
            className="w-20 h-20 mx-auto"
          />
        </motion.div>

        <motion.div variants={item} className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-[1px] bg-[#C79031]/60" />
          <span className="text-[#C79031]/80 text-xs tracking-[0.4em] uppercase font-medium">
            Wedding Invitation
          </span>
          <div className="w-8 h-[1px] bg-[#C79031]/60" />
        </motion.div>

        <motion.p variants={item} className="text-white/80 text-base font-light tracking-[0.15em] mb-2">
          Kepada Yth.
        </motion.p>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl font-bold mb-3"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          {guest.name}
        </motion.h1>

        <motion.div variants={item} className="flex items-center justify-center gap-3 mb-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#C79031]"
          />
          <p className="text-xl md:text-2xl text-[#C79031] font-medium">
            {guest.address}
          </p>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="w-2 h-2 rounded-full bg-[#C79031]"
          />
        </motion.div>

        <motion.div variants={item} className="relative inline-block">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2 bg-[#C79031]/20 rounded-full blur-md"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpen}
            className="relative bg-[#C79031] text-white font-bold px-14 py-4 rounded-full text-lg hover:bg-[#b07e25] transition-colors shadow-lg shadow-[#C79031]/30"
          >
            Buka Undangan
          </motion.button>
        </motion.div>

        <motion.div variants={item} className="mt-12 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#C79031]/60 rotate-45 rounded-[1px]" />
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C79031]/40" />
            <div className="w-2 h-2 bg-[#C79031]/60 rotate-45 rounded-[1px]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C79031]/40" />
            <div className="w-2 h-2 bg-[#C79031]/60 rotate-45 rounded-[1px]" />
          </div>
          <p className="text-white/50 text-sm italic">
            Mohon maaf apabila undangan ini disampaikan melalui media digital
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}