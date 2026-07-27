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

export default function CoupleInfo({ event }: { event: EventData }) {
  const people = [
    { name: event.brideFullName, role: event.brideRole, parents: event.brideParents, img: event.bridePhoto, social: event.brideSocial },
    { name: event.groomFullName, role: event.groomRole, parents: event.groomParents, img: event.groomPhoto, social: event.groomSocial },
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto bg-spotify-surface/50 rounded-t-3xl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-12"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-spotify-green/30" />
          <span className="text-spotify-green/60 text-xs tracking-[0.3em] uppercase">Mempelai</span>
          <div className="w-8 h-[1px] bg-spotify-green/30" />
        </motion.div>
        <motion.h2 custom={1} variants={fadeUp} className="text-4xl md:text-5xl font-bold text-glow mb-2">
          Dua Insan
        </motion.h2>
        <motion.p custom={2} variants={fadeUp} className="text-spotify-text">
          Yang dipersatukan dalam cinta & kasih sayang
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid md:grid-cols-2 gap-8"
      >
        {people.map((person, i) => (
          <motion.div
            key={person.name}
            custom={i}
            variants={fadeUp}
            className="group"
          >
            <div className="bg-gradient-card rounded-2xl p-8 text-center border border-white/5 hover:border-spotify-green/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(29,185,84,0.1)]">
              <div className="relative w-44 h-44 mx-auto mb-6">
                <div className="absolute inset-0 bg-spotify-green/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-full h-full rounded-full overflow-hidden border-2 border-spotify-green/20 group-hover:border-spotify-green/60 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(29,185,84,0.2)]"
                >
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="%23282828" width="200" height="200"/><text x="100" y="110" text-anchor="middle" fill="%236a6a6a" font-size="48">Photo</text></svg>';
                    }}
                  />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-spotify-green mb-1 group-hover:text-spotify-green-hover transition-colors">
                {person.name}
              </h3>
              <p className="text-spotify-text font-medium">{person.role}</p>
              <p className="text-spotify-text text-sm mt-1">{person.parents}</p>
              <div className="mt-5 flex justify-center gap-4">
                <span className="text-sm px-3 py-1.5 rounded-full bg-spotify-bg/50 hover:bg-spotify-green/20 transition-all cursor-pointer hover:scale-105 text-spotify-text">
                  {person.social}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 divider-gradient max-w-xs mx-auto" />
    </section>
  );
}