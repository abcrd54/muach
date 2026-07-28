import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { EventData } from '../../utils/api';
import Decoration from './Decoration';

const MONTHS: Record<string, number> = {
  januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
  juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
};

function parseDate(dateStr: string, timeStr: string): Date | null {
  const parts = dateStr.replace(/^[^,]+,?\s*/, '').trim().split(' ');
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = MONTHS[parts[1]?.toLowerCase()];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  const timeMatch = timeStr.match(/(\d{2}):(\d{2})/);
  if (!timeMatch) return null;
  return new Date(year, month, day, parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10));
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

const profileAnimations = [
  {
    hidden: { opacity: 0, x: -60, rotate: -5 },
    visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.7, type: 'spring' as const, bounce: 0.3 } },
  },
  {
    hidden: { opacity: 0, x: 60, rotate: 5 },
    visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.7, type: 'spring' as const, bounce: 0.3, delay: 0.2 } },
  },
];

export default function CoupleProfile({ event }: { event: EventData }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const target = parseDate(event.akadDate, event.akadTime);

  const update = useCallback(() => {
    if (!target) return;
    setTimeLeft(calcTimeLeft(target));
  }, [target]);

  useEffect(() => {
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [update]);

  const people = [
    { name: event.brideFullName, role: event.brideRole, parents: `${event.brideFather || ''}${event.brideFather && event.brideMother ? ' & ' : ''}${event.brideMother || ''}`, img: event.bridePhoto, social: event.brideSocial },
    { name: event.groomFullName, role: event.groomRole, parents: `${event.groomFather || ''}${event.groomFather && event.groomMother ? ' & ' : ''}${event.groomMother || ''}`, img: event.groomPhoto, social: event.groomSocial },
  ];

  const items = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section id="couple" className="py-8 md:py-16 px-6 max-w-4xl mx-auto relative">
      <Decoration type="flower-lotus" size={80} className="absolute top-0 left-1/2 -translate-x-1/2" opacity={0.06} />
      <Decoration type="ornament-diamond" size={24} className="absolute top-8 left-8" opacity={0.15} animated />
      <Decoration type="ornament-diamond" size={24} className="absolute top-8 right-8" opacity={0.15} animated />
      {target && (
        <>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-center text-gray-500 text-sm mb-3 tracking-wide"
          >
            Menuju Hari Bahagia
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-4 gap-2 md:gap-3 max-w-sm mx-auto mb-8"
          >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              custom={i}
              variants={fadeUp}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center shadow-md border border-[#C79031]/10"
            >
              <motion.div
                key={item.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl md:text-4xl font-bold text-[#C79031]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {String(item.value).padStart(2, '0')}
              </motion.div>
              <div className="text-[10px] md:text-xs text-gray-500 mt-0.5 tracking-wider uppercase">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
        </>
      )}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-8"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
          <span className="text-[#C79031]/70 text-xs tracking-[0.3em] uppercase">Mempelai</span>
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
        </motion.div>
        <motion.h2
          custom={1}
          variants={fadeUp}
          className="text-5xl md:text-6xl mb-2"
          style={{ fontFamily: "'Rouge Script', cursive", color: '#C79031' }}
        >
          Dua Insan
        </motion.h2>
        <motion.p custom={2} variants={fadeUp} className="text-gray-600">
          Yang dipersatukan dalam cinta & kasih sayang
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex justify-center mb-6"
      >
        <motion.div custom={3} variants={fadeUp} className="inline-flex items-center gap-2">
          <Decoration type="flower-single" size={24} opacity={0.25} />
          <div className="w-8 h-[1px] bg-[#C79031]/20" />
          <Decoration type="flower-bloom" size={32} opacity={0.35} animated />
          <div className="w-8 h-[1px] bg-[#C79031]/20" />
          <Decoration type="flower-single" size={24} opacity={0.25} />
        </motion.div>
      </motion.div>

      <div className="relative">
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Decoration type="heart-ornament" size={48} opacity={0.2} animated />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 gap-8 lg:gap-16"
        >
        {people.map((person, i) => (
          <motion.div
            key={person.name}
            variants={profileAnimations[i]}
            className="relative"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-md border border-[#C79031]/10 relative overflow-hidden">
                <Decoration type="flower-single" size={40} className="absolute -top-3 -left-3 rotate-45" opacity={0.12} />
                <Decoration type="flower-single" size={32} className="absolute -bottom-2 -right-2 -rotate-12" opacity={0.12} />
                <div className="relative z-10">
              <div className="relative w-44 h-44 mx-auto mb-6">
                <img
                  src="/assets/images/tema3/frame.svg"
                  alt=""
                  className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                />
                <div className="absolute inset-4 rounded-full overflow-hidden">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="%23f5f0e8" width="200" height="200"/><text x="100" y="110" text-anchor="middle" fill="%23C79031" font-size="48">Photo</text></svg>';
                    }}
                  />
                </div>
              </div>
              <h3
                className="text-3xl mb-1"
                style={{ fontFamily: "'Dancing Script', cursive", color: '#C79031' }}
              >
                {person.name}
              </h3>
              <p className="text-gray-600 font-medium text-sm">{person.role}</p>
              <p className="text-gray-500 text-sm mt-1">{person.parents}</p>
              {person.social && (
                <div className="mt-4">
                  <span className="text-xs px-4 py-1.5 rounded-full bg-[#C79031]/10 text-[#C79031] hover:bg-[#C79031]/20 transition-colors cursor-pointer">
                    {person.social}
                  </span>
                </div>
              )}
            </div>
          </div>
          </motion.div>
        ))}
      </motion.div>
      </div>

      <div className="mt-6 md:mt-10 flex justify-center">
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C79031]/40 to-transparent" />
      </div>
    </section>
  );
}