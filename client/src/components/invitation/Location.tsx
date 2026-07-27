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

export default function Location({ event }: { event: EventData }) {
  const events = [
    { title: event.akadTitle, date: event.akadDate, time: event.akadTime },
    { title: event.resepsiTitle, date: event.resepsiDate, time: event.resepsiTime },
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto bg-gradient-spotify">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-12"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-spotify-green/30" />
          <span className="text-spotify-green/60 text-xs tracking-[0.3em] uppercase">Lokasi</span>
          <div className="w-8 h-[1px] bg-spotify-green/30" />
        </motion.div>
        <motion.h2 custom={1} variants={fadeUp} className="text-4xl md:text-5xl font-bold text-glow mb-2">
          Lokasi Acara
        </motion.h2>
        <motion.p custom={2} variants={fadeUp} className="text-spotify-text">
          Kami menanti kehadiran Anda
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="bg-gradient-card rounded-2xl overflow-hidden border border-white/5 hover:border-spotify-green/20 transition-all duration-500"
      >
        <div className="aspect-video bg-spotify-card">
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
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((ev, i) => (
              <motion.div
                key={ev.title}
                custom={i + 3}
                variants={fadeUp}
                className="relative group"
              >
                <div className="absolute -top-1 left-0 w-8 h-8 bg-spotify-green/10 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-spotify-green" />
                </div>
                <div className="pl-12">
                  <h3 className="text-lg font-bold text-spotify-green mb-3 group-hover:text-spotify-green-hover transition-colors">
                    {ev.title}
                  </h3>
                  <div className="space-y-1.5">
                    <div className="text-spotify-text">{ev.date}</div>
                    <div className="text-spotify-text">{ev.time}</div>
                    <div className="text-spotify-white font-medium mt-3">{event.venueName}</div>
                    <p className="text-spotify-text text-sm">{event.venueAddress}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            custom={5}
            variants={fadeUp}
            className="mt-8 pt-6 border-t border-white/5 flex justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={event.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Buka di Google Maps
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-12 divider-gradient max-w-xs mx-auto" />
    </section>
  );
}