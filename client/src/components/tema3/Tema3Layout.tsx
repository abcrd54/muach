import { EventData } from '../../utils/api';
import { Volume2, VolumeX } from 'lucide-react';
import CoupleProfile from './CoupleProfile';
import EventDetail from './EventDetail';
import Tema3Gallery from './Tema3Gallery';
import GuestbookPublik from './GuestbookPublik';
import Tema3Footer from './Tema3Footer';
import BottomNav from './BottomNav';
import FallingFlowers from './FallingFlowers';

interface Tema3LayoutProps {
  event: EventData;
  guestId: string;
  guestName: string;
  eventSlug: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function Tema3Layout({ event, guestId, guestName, eventSlug, isPlaying, onTogglePlay }: Tema3LayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)' }}>
      <button
        onClick={onTogglePlay}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-[#C79031]/20 flex items-center justify-center hover:bg-white transition-colors"
        title={isPlaying ? 'Matikan Musik' : 'Nyalakan Musik'}
      >
        {isPlaying ? (
          <Volume2 size={18} className="text-[#C79031]" />
        ) : (
          <VolumeX size={18} className="text-gray-400" />
        )}
      </button>
      <FallingFlowers />
      <CoupleProfile event={event} />
      <EventDetail event={event} />
      <Tema3Gallery />
      <GuestbookPublik guestId={guestId} guestName={guestName} eventSlug={eventSlug} />
      <Tema3Footer event={event} />
      <BottomNav />
    </div>
  );
}