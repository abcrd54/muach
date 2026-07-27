import { motion } from 'motion/react';
import { EventData } from '../../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.2 },
  }),
};

export default function Closing({ event }: { event: EventData }) {
  return (
    <section className="py-20 px-6 max-w-2xl mx-auto text-center">
      <div className="divider-gradient max-w-xs mx-auto mb-12" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="space-y-10"
      >
        <motion.div custom={0} variants={fadeUp}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-spotify-green/30" />
            <span className="text-spotify-green/60 text-xs tracking-[0.3em] uppercase">
              Terima Kasih
            </span>
            <div className="w-8 h-[1px] bg-spotify-green/30" />
          </div>
          <p className="text-spotify-text text-lg leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan apabila
            Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu
            kepada kedua mempelai.
          </p>
        </motion.div>

        <motion.div custom={1} variants={fadeUp}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-spotify-green/30" />
            <span className="text-spotify-green/60 text-xs tracking-[0.3em] uppercase">
              Doa Restu
            </span>
            <div className="w-8 h-[1px] bg-spotify-green/30" />
          </div>
          <p className="text-spotify-text text-lg leading-relaxed italic">
            "Semoga Allah SWT memberkahi pernikahan ini, menghimpun
            keduanya dalam kebaikan, dan menjadikan keluarga yang
            sakinah, mawaddah, warahmah."
          </p>
        </motion.div>

        <motion.div custom={2} variants={fadeUp} className="pt-4">
          <h3 className="text-2xl md:text-3xl font-bold text-spotify-white mb-3">
            {event.coupleName1} & {event.coupleName2}
          </h3>
          <p className="text-spotify-text text-sm tracking-[0.2em] uppercase">
            Kedua Mempelai
          </p>
        </motion.div>

        <motion.div custom={3} variants={fadeUp} className="text-spotify-text-secondary text-sm space-y-1">
          <p>Merupakan suatu kebahagiaan tersendiri</p>
          <p>atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i</p>
        </motion.div>

        <motion.div custom={4} variants={fadeUp}>
          <p className="text-2xl font-bold text-spotify-green tracking-widest" dir="rtl">
            وَالسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
          </p>
          <p className="text-spotify-text-secondary text-sm mt-2">
            Wassalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
        </motion.div>
      </motion.div>

      <div className="mt-16 divider-gradient max-w-xs mx-auto" />
    </section>
  );
}