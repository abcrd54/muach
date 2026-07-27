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

export default function Tema3Footer({ event }: { event: EventData }) {
  return (
    <section id="footer" className="relative pt-8 pb-20 md:pt-16 md:pb-32 px-6 text-center">
      <div className="absolute top-0 left-4 w-8 h-8 text-[#C79031]/10 rotate-45">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 10 8 6 10C10 10 12 16 12 16C12 16 14 10 18 10C14 8 12 2 12 2Z"/></svg>
      </div>
      <div className="absolute top-0 right-4 w-6 h-6 text-[#C79031]/10 -rotate-12">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 10 8 6 10C10 10 12 16 12 16C12 16 14 10 18 10C14 8 12 2 12 2Z"/></svg>
      </div>
      <img
        src="/assets/images/tema3/footer_t.svg"
        alt=""
        className="w-full h-8 object-fill opacity-60 mb-8"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="space-y-8 max-w-xl mx-auto"
      >
        <motion.div custom={0} variants={fadeUp}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#C79031]/40" />
            <span className="text-[#C79031]/70 text-xs tracking-[0.3em] uppercase">
              Terima Kasih
            </span>
            <div className="w-8 h-[1px] bg-[#C79031]/40" />
          </div>
          <p className="text-gray-600 text-lg leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan apabila
            Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu
            kepada kedua mempelai.
          </p>
        </motion.div>

        <motion.div custom={1} variants={fadeUp} className="pt-4">
          <h3
            className="text-4xl md:text-5xl mb-3"
            style={{ fontFamily: "'Dancing Script', cursive", color: '#C79031' }}
          >
            {event.coupleName1} & {event.coupleName2}
          </h3>
          <p className="text-gray-500 text-sm tracking-[0.2em] uppercase">
            Kedua Mempelai
          </p>
        </motion.div>

        <motion.div custom={2} variants={fadeUp} className="text-gray-400 text-sm space-y-1">
          <p>Merupakan suatu kebahagiaan tersendiri</p>
          <p>atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i</p>
        </motion.div>

        <motion.div custom={3} variants={fadeUp}>
          <p className="text-2xl font-bold text-[#C79031] tracking-widest" dir="rtl">
            وَالسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
        </motion.div>
      </motion.div>

      <img
        src="/assets/images/tema3/footer_b.svg"
        alt=""
        className="w-full h-8 object-fill opacity-60 mt-8"
      />
    </section>
  );
}