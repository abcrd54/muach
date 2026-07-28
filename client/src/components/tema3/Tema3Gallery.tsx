import { motion } from 'motion/react';
import Decoration from './Decoration';

const PHOTOS = [
  { src: '/assets/images/gallery/gallery-1.JPG', alt: 'Gallery 1' },
  { src: '/assets/images/gallery/gallery-2.JPG', alt: 'Gallery 2' },
  { src: '/assets/images/gallery/gallery-3.JPG', alt: 'Gallery 3' },
  { src: '/assets/images/gallery/gallery-4.JPG', alt: 'Gallery 4' },
  { src: '/assets/images/gallery/gallery-5.JPG', alt: 'Gallery 5' },
  { src: '/assets/images/gallery/gallery-6.JPG', alt: 'Gallery 6' },
];

const PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect fill="%23f5f0e8" width="400" height="400"/><text x="200" y="210" text-anchor="middle" fill="%23C79031" font-size="48">Photo</text></svg>';

const galleryAnimations = [
  { hidden: { opacity: 0, scale: 0.8, y: 30 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } },
  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } } },
  { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.3 } } },
  { hidden: { opacity: 0, scale: 0.6, rotate: 5 }, visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5, delay: 0.4 } } },
  { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } } },
  { hidden: { opacity: 0, rotate: -8, scale: 0.7 }, visible: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.5, delay: 0.6 } } },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export default function Tema3Gallery() {
  return (
    <section id="gallery" className="py-8 md:py-16 px-6 max-w-2xl mx-auto relative">
      <Decoration type="flower-single" size={40} className="absolute top-0 right-4 -rotate-12" opacity={0.1} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-6"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
          <span className="text-[#C79031]/70 text-xs tracking-[0.3em] uppercase">Galeri</span>
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
        </motion.div>
        <motion.h2
          custom={1}
          variants={fadeUp}
          className="text-5xl md:text-6xl mb-2"
          style={{ fontFamily: "'Rouge Script', cursive", color: '#C79031' }}
        >
          Galeri Foto
        </motion.h2>
        <motion.p custom={2} variants={fadeUp} className="text-gray-600">
          Momen indah yang tak terlupakan
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-2 gap-0"
      >
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={i}
            variants={galleryAnimations[i]}
            className="overflow-hidden"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              src={photo.src}
              alt={photo.alt}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER;
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 md:mt-10 flex justify-center">
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#C79031]/40 to-transparent" />
      </div>
    </section>
  );
}