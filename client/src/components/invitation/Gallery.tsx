import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PHOTOS = [
  { src: '/assets/images/gallery/gallery-1.JPG', alt: 'Gallery 1', cols: 2, rows: 2 },
  { src: '/assets/images/gallery/gallery-2.JPG', alt: 'Gallery 2', cols: 1, rows: 2 },
  { src: '/assets/images/gallery/gallery-3.JPG', alt: 'Gallery 3', cols: 1, rows: 1 },
  { src: '/assets/images/gallery/gallery-4.JPG', alt: 'Gallery 4', cols: 1, rows: 1 },
  { src: '/assets/images/gallery/gallery-5.JPG', alt: 'Gallery 5', cols: 2, rows: 1 },
  { src: '/assets/images/gallery/gallery-6.JPG', alt: 'Gallery 6', cols: 2, rows: 1 },
];

const PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="%23282828" width="400" height="400"/><text x="200" y="210" text-anchor="middle" fill="%236a6a6a" font-size="48">Photo</text></svg>';

const ANIMATIONS = [
  { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, type: 'spring' as const, bounce: 0.3 } } },
  { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring' as const, bounce: 0.4 } } },
  { hidden: { opacity: 0, scale: 0.8, rotate: -5 }, visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5, ease: 'backOut' as const } } },
  { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, type: 'spring' as const, bounce: 0.3 } } },
  { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring' as const, bounce: 0.35 } } },
  { hidden: { opacity: 0, scale: 0.6, rotate: 5 }, visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5, ease: 'backOut' as const } } },
];

const headingFade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="py-16 max-w-2xl mx-auto px-0">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-10 px-6"
      >
        <motion.div custom={0} variants={headingFade} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-spotify-green/30" />
          <span className="text-spotify-green/60 text-xs tracking-[0.3em] uppercase">Galeri</span>
          <div className="w-8 h-[1px] bg-spotify-green/30" />
        </motion.div>
        <motion.h2 custom={1} variants={headingFade} className="text-4xl font-bold text-glow mb-2">
          Galeri Foto
        </motion.h2>
        <motion.p custom={2} variants={headingFade} className="text-spotify-text text-sm">
          Momen indah yang tak terlupakan
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-2 gap-0"
        style={{ gridAutoRows: 'minmax(120px, auto)' }}
      >
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={i}
            variants={ANIMATIONS[i]}
            onClick={() => setSelected(i)}
            className="cursor-pointer group relative overflow-hidden"
            style={{
              gridColumn: `span ${photo.cols}`,
              gridRow: `span ${photo.rows}`,
            }}
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER;
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 flex items-end justify-center pb-2"
            >
              <span className="text-spotify-white text-[10px] font-medium bg-spotify-green/80 px-2 py-0.5 rounded-full">
                Lihat
              </span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 text-spotify-white text-2xl hover:text-spotify-green transition-colors z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setSelected(null)}
            >
              &times;
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-spotify-white text-4xl hover:text-spotify-green transition-colors z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setSelected((prev) => (prev! > 0 ? prev! - 1 : PHOTOS.length - 1));
              }}
            >
              &lsaquo;
            </motion.button>

            <motion.img
              key={selected}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              src={PHOTOS[selected].src}
              alt={PHOTOS[selected].alt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER;
              }}
            />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-spotify-white text-4xl hover:text-spotify-green transition-colors z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setSelected((prev) => (prev! < PHOTOS.length - 1 ? prev! + 1 : 0));
              }}
            >
              &rsaquo;
            </motion.button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {PHOTOS.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.3 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === selected ? 'bg-spotify-green' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  animate={i === selected ? { scale: 1.3 } : { scale: 1 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}