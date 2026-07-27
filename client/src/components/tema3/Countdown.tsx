import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { EventData } from '../../utils/api';

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
  const hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);

  return new Date(year, month, day, hours, minutes);
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

export default function Countdown({ event }: { event: EventData }) {
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

  if (!target) return null;

  const items = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-8 md:py-16 px-6 max-w-2xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-6"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
          <span className="text-[#C79031]/70 text-xs tracking-[0.3em] uppercase">Countdown</span>
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
        </motion.div>
        <motion.h2
          custom={1}
          variants={fadeUp}
          className="text-5xl md:text-6xl mb-2"
          style={{ fontFamily: "'Rouge Script', cursive", color: '#C79031' }}
        >
          Menuju Hari Bahagia
        </motion.h2>
        <motion.p custom={2} variants={fadeUp} className="text-gray-600">
          {event.akadDate} | {event.akadTime}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-4 gap-3 md:gap-4"
      >
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            variants={fadeUp}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center shadow-md border border-[#C79031]/10"
          >
            <motion.div
              key={item.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl md:text-5xl font-bold text-[#C79031]"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {String(item.value).padStart(2, '0')}
            </motion.div>
            <div className="text-xs md:text-sm text-gray-500 mt-1 tracking-wider uppercase">
              {item.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 md:mt-10 flex justify-center">
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C79031]/40 to-transparent" />
      </div>
    </section>
  );
}