import { motion } from 'motion/react';
import { EventData } from '../../utils/api';
import Decoration from './Decoration';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function EventDetail({ event }: { event: EventData }) {
  const events = [
    { title: 'Akad Nikah', date: event.akadDate, time: event.akadTime },
    { title: 'Resepsi', date: event.resepsiDate, time: event.resepsiTime },
  ];

  return (
    <section id="event" className="py-8 md:py-16 px-6 max-w-2xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-6"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
          <span className="text-[#C79031]/70 text-xs tracking-[0.3em] uppercase">Acara</span>
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
        </motion.div>
        <motion.h2
          custom={1}
          variants={fadeUp}
          className="text-5xl md:text-6xl mb-2"
          style={{ fontFamily: "'Rouge Script', cursive", color: '#C79031' }}
        >
          Detail Acara
        </motion.h2>
        <motion.p custom={2} variants={fadeUp} className="text-gray-600">
          Kami menanti kehadiran Anda
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md border border-[#C79031]/10 relative"
      >
        <Decoration type="flower-single" size={40} className="absolute -top-2 -right-2 rotate-12 z-10" opacity={0.12} />
        <Decoration type="flower-single" size={48} className="absolute -bottom-3 -left-3 -rotate-45 z-10" opacity={0.12} />
        <div className="aspect-video">
          <iframe
            src={event.mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((ev, i) => (
              <motion.div
                key={ev.title}
                custom={i + 3}
                variants={fadeUp}
                className="relative"
              >
                <div className="absolute -top-1 left-0 w-8 h-8 bg-[#C79031]/10 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#C79031]" />
                </div>
                <div className="pl-11">
                  <h3 className="text-lg font-bold text-[#C79031] mb-2">
                    {ev.title}
                  </h3>
                  <div className="space-y-1">
                    <div className="text-gray-600 text-sm">{ev.date}</div>
                    <div className="text-gray-600 text-sm">{ev.time}</div>
                    <div className="text-gray-800 font-medium mt-3 text-sm">{event.venueName}</div>
                    <p className="text-gray-500 text-xs">{event.venueAddress}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={5}
            variants={fadeUp}
            className="mt-6 pt-6 border-t border-[#C79031]/10 flex justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={event.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#C79031] text-[#C79031] font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-[#C79031] hover:text-white transition-colors"
            >
              Buka di Google Maps
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-6 md:mt-10 flex justify-center">
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C79031]/40 to-transparent" />
      </div>
    </section>
  );
}