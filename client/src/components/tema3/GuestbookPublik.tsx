import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, RSVPItem } from '../../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15 },
  }),
};

const badgeMap: Record<string, { label: string; color: string }> = {
  yes: { label: 'Hadir', color: 'bg-green-100 text-green-700' },
  no: { label: 'Tidak Hadir', color: 'bg-red-100 text-red-700' },
  maybe: { label: 'Ragu', color: 'bg-yellow-100 text-yellow-700' },
};

export default function GuestbookPublik({ guestId, guestName, eventSlug }: { guestId: string; guestName: string; eventSlug: string }) {
  const [rsvps, setRsvps] = useState<RSVPItem[]>([]);
  const [name, setName] = useState(guestName);
  const [attendance, setAttendance] = useState<'yes' | 'no' | 'maybe' | ''>('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(guestName);
  }, [guestName]);

  useEffect(() => {
    api.getRSVPs(eventSlug).then(setRsvps).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendance) {
      setError('Pilih status kehadiran');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.submitRSVP(eventSlug, {
        guestId,
        name,
        attendance: attendance as 'yes' | 'no' | 'maybe',
        message,
      });
      setSubmitted(true);
      const updated = await api.getRSVPs(eventSlug);
      setRsvps(updated);
    } catch {
      setError('Gagal mengirim konfirmasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="guestbook" className="py-8 md:py-16 px-6 max-w-2xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-6"
      >
        <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-3 mb-3">
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
          <span className="text-[#C79031]/70 text-xs tracking-[0.3em] uppercase">Guestbook</span>
          <div className="w-8 h-[1px] bg-[#C79031]/40" />
        </motion.div>
        <motion.h2
          custom={1}
          variants={fadeUp}
          className="text-5xl md:text-6xl mb-2"
          style={{ fontFamily: "'Rouge Script', cursive", color: '#C79031' }}
        >
          Ucapan & Doa
        </motion.h2>
        <motion.p custom={2} variants={fadeUp} className="text-gray-600">
          Berikan ucapan dan doa terbaik untuk kedua mempelai
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="mb-6"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              custom={3}
              variants={fadeUp}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-md border border-[#C99031]/10"
            >
              <div className="w-12 h-12 rounded-full bg-[#C79031]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#C79031]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#C79031] mb-2">Terima Kasih!</h3>
              <p className="text-gray-600">Konfirmasi kehadiran Anda telah kami terima.</p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-md border border-[#C79031]/10 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C79031] focus:ring-1 focus:ring-[#C79031]/30 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">Status Kehadiran</label>
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
                      className={`flex-1 py-3.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        attendance === opt.value
                          ? 'border-[#C79031] bg-[#C79031]/10 text-[#C79031]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Ucapan & Doa</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C79031] focus:ring-1 focus:ring-[#C79031]/30 transition-all resize-none"
                  placeholder="Tulis ucapan atau doa untuk kedua mempelai..."
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                  >
                    <p className="text-red-500 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#C79031] text-white font-bold py-3.5 rounded-xl hover:bg-[#b07e25] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <span>Kirim Konfirmasi</span>
                )}
              </motion.button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#C79031]/40" />
        <span className="text-[#C79031]/70 text-xs tracking-[0.3em] uppercase">
          {rsvps.length} Ucapan
        </span>
        <div className="w-8 h-[1px] bg-[#C79031]/40" />
      </div>

      {rsvps.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">Belum ada ucapan. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-4">
          {rsvps.slice().reverse().map((rsvp, i) => {
            const badge = badgeMap[rsvp.attendance] || badgeMap.maybe;
            const initial = rsvp.name.charAt(0).toUpperCase();
            return (
              <motion.div
                key={rsvp.guestId + rsvp.createdAt}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-[#C79031]/5"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#C79031]/10 flex items-center justify-center">
                      <span className="text-[#C79031] text-sm font-bold">{initial}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{rsvp.name}</p>
                      <p className="text-gray-400 text-xs">{new Date(rsvp.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                {rsvp.message && (
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{rsvp.message}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}