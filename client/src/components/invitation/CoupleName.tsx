import { motion } from 'motion/react';
import { EventData } from '../../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function CoupleName({ event }: { event: EventData }) {
  return (
    <section className="py-24 px-6 text-center relative bg-gradient-to-b from-spotify-bg via-spotify-bg to-spotify-surface/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-spotify-green/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-t from-spotify-green/40 to-transparent" />

      <div className="absolute top-1/4 left-0 right-0 flex justify-center gap-4 pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            className="w-1.5 h-1.5 rounded-full bg-spotify-green/20"
            style={{ marginTop: i % 2 === 0 ? 0 : -20 }}
          />
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="space-y-8"
      >
        <motion.div custom={0} variants={fadeUp} className="relative inline-block">
          <div className="flex items-center gap-4">
            <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-spotify-green/50" />
            <div className="ornament-diamond" />
            <span className="text-spotify-green text-sm tracking-[0.4em] uppercase font-medium">
              The Wedding Of
            </span>
            <div className="ornament-diamond" />
            <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-spotify-green/50" />
          </div>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} className="relative">
          <h1 className="text-5xl md:text-8xl font-bold text-glow-strong">
            <span className="block md:inline">{event.coupleName1}</span>
            <motion.svg
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              className="inline-block w-10 h-10 md:w-14 md:h-14 mx-3 md:mx-6 text-spotify-green"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
            <span className="block md:inline">{event.coupleName2}</span>
          </h1>
        </motion.div>

        <motion.div custom={2} variants={fadeUp} className="flex items-center justify-center gap-6">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-spotify-green/40" />
          <p className="text-spotify-text text-lg">{event.weddingDate}</p>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-spotify-green/40" />
        </motion.div>

        <motion.div custom={3} variants={fadeUp} className="max-w-xl mx-auto">
          <div className="relative bg-spotify-surface/50 rounded-2xl px-8 py-6 border border-white/5">
            <div className="absolute top-0 left-8 -translate-y-1/2 text-spotify-green/40 text-2xl">&ldquo;</div>
            <p className="text-spotify-text text-base italic leading-relaxed">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
              pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa
              tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
            </p>
            <div className="absolute bottom-0 right-8 translate-y-1/2 text-spotify-green/40 text-2xl">&rdquo;</div>
          </div>
          <p className="mt-4 text-spotify-green/60 text-sm font-medium">&mdash; QS. Ar-Rum: 21</p>
        </motion.div>
      </motion.div>

      <div className="mt-12 divider-gradient max-w-xs mx-auto" />
    </section>
  );
}