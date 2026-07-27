import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  isVisible: boolean;
}

export default function MusicPlayer({ isPlaying, onTogglePlay, isVisible }: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = document.querySelector('audio');
    if (audio) {
      audioRef.current = audio;
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [isVisible]);

  const formatTime = (t: number) => {
    if (isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#181818]/95 backdrop-blur-lg border-t border-[#282828]"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-spotify-green/30 to-transparent" />

          <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3">
            <div className="relative flex-shrink-0">
              <motion.div
                animate={isPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-spotify-green/20 to-spotify-green/5 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-spotify-green" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </motion.div>
              {isPlaying && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 10, 4] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1 bg-spotify-green rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <p className="text-sm font-semibold text-spotify-white truncate">Wedding Song</p>
                <span className="text-[10px] text-spotify-green/60 bg-spotify-green/10 px-2 py-0.5 rounded-full font-medium">
                  Instrumental
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-spotify-text-secondary w-9 font-mono">
                  {formatTime(currentTime)}
                </span>
                <div
                  className="flex-1 h-1.5 bg-[#535353]/50 rounded-full cursor-pointer group relative hover:h-2 transition-all"
                  onClick={handleSeek}
                >
                  <motion.div
                    className="h-full bg-spotify-green rounded-full relative group-hover:bg-spotify-green-hover transition-colors"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </motion.div>
                </div>
                <span className="text-[11px] text-spotify-text-secondary w-9 font-mono">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onTogglePlay}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isPlaying
                  ? 'bg-spotify-green text-black hover:bg-spotify-green-hover'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}