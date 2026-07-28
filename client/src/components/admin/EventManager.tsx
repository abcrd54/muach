import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api, EventData } from '../../utils/api';

interface EventManagerProps {
  token: string;
  eventSlug: string;
  onEventChange: (slug: string) => void;
}

export default function EventManager({ token, eventSlug, onEventChange }: EventManagerProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName1, setNewName1] = useState('');
  const [newName2, setNewName2] = useState('');
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      const data = await api.getEvents(token);
      setEvents(data);
      if (data.length > 0 && !data.find((e) => e.slug === eventSlug)) {
        onEventChange(data[0].slug || '');
      }
    } catch {}
  };

  useEffect(() => { fetchEvents(); }, [token]);

  const handleCreate = async () => {
    if (!newName1.trim() || !newName2.trim()) return;
    setCreating(true);
    setMessage('');
    try {
      const event = await api.createEvent(token, { coupleName1: newName1, coupleName2: newName2 });
      setNewName1('');
      setNewName2('');
      setShowCreate(false);
      setMessage('Event berhasil dibuat');
      await fetchEvents();
      onEventChange(event.slug || '');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Gagal membuat event');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Hapus event ini? Semua data tamu & RSVP akan terhapus.')) return;
    try {
      await api.deleteEvent(token, slug);
      await fetchEvents();
      if (eventSlug === slug) {
        const remaining = events.filter((e) => e.slug !== slug);
        onEventChange(remaining[0]?.slug || '');
      }
    } catch {}
  };

  return (
    <div className="card-spotify mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Event / Acara</h3>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-spotify text-sm">
          {showCreate ? 'Batal' : '+ Event Baru'}
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 p-4 bg-spotify-bg rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-spotify-text text-xs mb-1">Nama Pengantin 1</label>
              <input value={newName1} onChange={(e) => setNewName1(e.target.value)} className="w-full bg-spotify-surface border border-[#404040] rounded-lg px-3 py-2 text-spotify-white text-sm focus:border-spotify-green focus:outline-none" placeholder="Icha" />
            </div>
            <div>
              <label className="block text-spotify-text text-xs mb-1">Nama Pengantin 2</label>
              <input value={newName2} onChange={(e) => setNewName2(e.target.value)} className="w-full bg-spotify-surface border border-[#404040] rounded-lg px-3 py-2 text-spotify-white text-sm focus:border-spotify-green focus:outline-none" placeholder="Farid" />
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating} className="btn-spotify text-sm disabled:opacity-50">
            {creating ? 'Membuat...' : 'Buat Event'}
          </button>
        </div>
      )}

      {message && <p className={`text-sm mb-3 ${message.includes('berhasil') ? 'text-spotify-green' : 'text-red-500'}`}>{message}</p>}

      <div className="flex flex-wrap gap-2">
        {events.map((ev) => (
          <motion.div key={ev.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
            <button
              onClick={() => onEventChange(ev.slug || '')}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                eventSlug === ev.slug
                  ? 'bg-spotify-green text-black font-medium'
                  : 'bg-spotify-surface text-spotify-text hover:bg-[#404040]'
              }`}
            >
              {ev.coupleName1} & {ev.coupleName2}
            </button>
            <button
              onClick={() => handleDelete(ev.slug || '')}
              className="text-red-500 hover:text-red-400 text-xs px-1"
              title="Hapus event"
            >
              x
            </button>
          </motion.div>
        ))}
        {events.length === 0 && !showCreate && (
          <p className="text-spotify-text text-sm">Belum ada event. Buat event baru untuk memulai.</p>
        )}
      </div>
    </div>
  );
}