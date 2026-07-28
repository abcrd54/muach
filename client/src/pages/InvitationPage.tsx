import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { api, Guest, EventData, DEFAULT_EVENT } from '../utils/api';
import Cover from '../components/invitation/Cover';
import Tema3Cover from '../components/tema3/Tema3Cover';
import Tema3Layout from '../components/tema3/Tema3Layout';
import CoupleName from '../components/invitation/CoupleName';
import CoupleInfo from '../components/invitation/CoupleInfo';
import Location from '../components/invitation/Location';
import Gallery from '../components/invitation/Gallery';
import RSVPForm from '../components/invitation/RSVPForm';
import Closing from '../components/invitation/Closing';
import MusicPlayer from '../components/invitation/MusicPlayer';
import Particles from '../components/invitation/Particles';

export default function InvitationPage() {
  const { eventSlug, guestSlug } = useParams<{ eventSlug: string; guestSlug: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [event, setEvent] = useState<EventData>(DEFAULT_EVENT);
  const [theme, setTheme] = useState<string>('spotify');
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (eventSlug) {
      api.getConfig(eventSlug).then((config) => {
        document.documentElement.setAttribute('data-theme', config.theme);
        setTheme(config.theme);
      }).catch(() => {});
      api.getEvent(eventSlug).then(setEvent).catch(() => {});
    }
  }, [eventSlug]);

  useEffect(() => {
    if (eventSlug && guestSlug) {
      api.getGuestBySlug(eventSlug, guestSlug)
        .then(setGuest)
        .catch(() => setGuest(null))
        .finally(() => setLoading(false));
    }
  }, [eventSlug, guestSlug]);

  const handleOpen = () => {
    setIsOpen(true);
    const audio = audioRef.current;
    if (audio) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        document.addEventListener('click', function playOnInteraction() {
          audio.play().then(() => setIsPlaying(true)).catch(() => {});
          document.removeEventListener('click', playOnInteraction);
        }, { once: true });
      });
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // autoplay blocked
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-spotify-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-spotify-green border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-spotify-text">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen bg-spotify-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-spotify-green mb-4">404</h1>
          <p className="text-spotify-text text-xl">Undangan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const isTema3 = theme === 'tema3';

  return (
    <div className="min-h-screen bg-spotify-bg relative overflow-x-hidden">
      <audio
        ref={audioRef}
        src="/assets/music/lagu.mp3"
        loop
        preload="auto"
      />

      {!isTema3 && <Particles />}

      <AnimatePresence mode="wait">
        {isOpen ? (
          isTema3 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <Tema3Layout event={event} guestId={guest.id} guestName={guest.name} eventSlug={eventSlug || ''} isPlaying={isPlaying} onTogglePlay={togglePlay} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="pb-28 relative z-10"
            >
              <CoupleName event={event} />
              <div className="relative h-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-spotify-bg via-spotify-surface/40 to-spotify-surface/50" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-spotify-green/30 to-transparent" />
              </div>
              <CoupleInfo event={event} />
              <div className="relative h-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-spotify-surface/50 via-spotify-bg to-spotify-bg" />
              </div>
              <Location event={event} />
              <div className="relative h-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-spotify-bg to-spotify-surface/30" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-spotify-green/30 to-transparent" />
              </div>
              <Gallery />
              <div className="relative h-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-spotify-surface/30 to-spotify-bg" />
              </div>
              <RSVPForm guestId={guest.id} guestName={guest.name} eventSlug={eventSlug || ''} />
              <Closing event={event} />
            </motion.div>
          )
        ) : isTema3 ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Tema3Cover guest={guest} onOpen={handleOpen} />
          </motion.div>
        ) : (
          <motion.div
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <Cover guest={guest} onOpen={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      {!isTema3 && (
        <MusicPlayer
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          isVisible={isOpen}
        />
      )}
    </div>
  );
}