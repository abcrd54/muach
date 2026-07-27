import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, Image, MessageSquare, HeartHandshake } from 'lucide-react';

const sections = [
  { id: 'couple', icon: Heart, label: 'Mempelai' },
  { id: 'event', icon: Calendar, label: 'Acara' },
  { id: 'gallery', icon: Image, label: 'Galeri' },
  { id: 'guestbook', icon: MessageSquare, label: 'Ucapan' },
  { id: 'footer', icon: HeartHandshake, label: 'Closing' },
];

export default function BottomNav() {
  const [active, setActive] = useState('couple');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center"
    >
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 rounded-full shadow-lg"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 -6px 10px -5px hsla(0,0%,44.3%,0.3), 0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        {sections.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="relative flex flex-col items-center justify-center px-2 py-1 cursor-pointer group"
              title={label}
            >
              <Icon
                size={16}
                className={`transition-colors duration-300 ${
                  isActive ? 'text-[#C79031]' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-[9px] mt-0.5 transition-colors duration-300 whitespace-nowrap ${
                  isActive ? 'text-[#C79031] font-medium' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C79031]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}