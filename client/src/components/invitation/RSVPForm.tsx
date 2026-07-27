import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../utils/api';

interface RSVPFormProps {
  guestId: string;
  guestName: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

export default function RSVPForm({ guestId, guestName }: RSVPFormProps) {
  const [name, setName] = useState(guestName);
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe' | ''>('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(guestName);
  }, [guestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance) {
      setError('Pilih status kehadiran');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.submitRSVP({
        guestId,
        name,
        attendance: attendance as 'yes' | 'no' | 'maybe',
        message,
      });
      setSubmitted(true);
    } catch {
      setError('Gagal mengirim konfirmasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-6 max-w-lg mx-auto bg-gradient-to-b from-spotify-surface/30 to-spotify-bg">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-card rounded-2xl p-10 text-center border border-spotify-green/20"
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-spotify-green/10 rounded-full blur-xl" />
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-12 h-12 mx-auto text-spotify-green"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </div>
            <h2 className="text-2xl font-bold text-spotify-green mb-3">Terima Kasih!</h2>
            <p className="text-spotify-text leading-relaxed">
              Konfirmasi kehadiran Anda telah kami terima.<br />
              Sampai jumpa di hari bahagia kami!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="text-center mb-10"
            >
              <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
                <div className="w-8 h-[1px] bg-spotify-green/30" />
                <span className="text-spotify-green/60 text-xs tracking-[0.3em] uppercase">RSVP</span>
                <div className="w-8 h-[1px] bg-spotify-green/30" />
              </motion.div>
              <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-glow mb-2">
                Konfirmasi Kehadiran
              </motion.h2>
              <motion.p custom={2} variants={fadeUp} className="text-spotify-text">
                Silakan isi form di bawah ini
              </motion.p>
            </motion.div>

            <form onSubmit={handleSubmit} className="bg-gradient-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-spotify-text mb-2">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-spotify-bg border border-[#404040] rounded-xl px-4 py-3.5 text-spotify-white placeholder-spotify-text-secondary focus:outline-none focus:border-spotify-green focus:ring-1 focus:ring-spotify-green/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-spotify-text mb-3">Status Kehadiran</label>
                <div className="flex gap-3">
                  {[
                    { value: 'yes', label: 'Hadir' },
                    { value: 'no', label: 'Tidak Hadir' },
                    { value: 'maybe', label: 'Ragu' },
                  ].map((opt) => (
                    <motion.button
                      key={opt.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAttendance(opt.value as 'yes' | 'no' | 'maybe')}
                      animate={attendance === opt.value ? { scale: [1, 1.03, 1] } : {}}
                      className={`flex-1 py-3.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        attendance === opt.value
                          ? 'border-spotify-green bg-spotify-green/10 text-spotify-green shadow-[0_0_10px_rgba(29,185,84,0.15)]'
                          : 'border-[#404040] text-spotify-text hover:border-spotify-text/60 hover:bg-white/5'
                      }`}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-spotify-text mb-2">Ucapan & Doa</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-spotify-bg border border-[#404040] rounded-xl px-4 py-3.5 text-spotify-white placeholder-spotify-text-secondary focus:outline-none focus:border-spotify-green focus:ring-1 focus:ring-spotify-green/30 transition-all resize-none"
                  placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-spotify w-full disabled:opacity-50 flex items-center justify-center gap-2 text-base py-3.5"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <span>Kirim Konfirmasi</span>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 divider-gradient max-w-xs mx-auto" />
    </section>
  );
}