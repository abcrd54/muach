import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api, Guest } from '../../utils/api';
import GuestForm from './GuestForm';

interface GuestListProps {
  token: string;
  eventSlug: string;
}

export default function GuestList({ token, eventSlug }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    if (!eventSlug) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await api.getGuests(token, eventSlug);
      setGuests(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuests(); }, [eventSlug, token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus tamu ini?')) return;
    try {
      await api.deleteGuest(token, eventSlug, id);
      fetchGuests();
    } catch {}
  };

  const handleSaved = () => {
    setEditing(null);
    setShowForm(false);
    fetchGuests();
  };

  const copyLink = (guest: Guest) => {
    const link = `${window.location.origin}/${eventSlug}/${guest.slug}`;
    navigator.clipboard.writeText(link);
  };

  if (loading) {
    return <div className="card-spotify mb-6"><p className="text-spotify-text">Loading daftar tamu...</p></div>;
  }

  if (!eventSlug) {
    return <div className="card-spotify mb-6"><p className="text-spotify-text">Pilih event terlebih dahulu</p></div>;
  }

  return (
    <div className="card-spotify mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daftar Tamu ({guests.length})</h3>
        <button onClick={() => { setEditing(null); setShowForm(!showForm); }} className="btn-spotify text-sm">
          {showForm ? 'Tutup' : '+ Tambah Tamu'}
        </button>
      </div>

      {showForm && (
        <GuestForm token={token} eventSlug={eventSlug} editingGuest={editing} onSaved={handleSaved} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}

      {guests.length === 0 && !showForm ? (
        <p className="text-spotify-text text-sm">Belum ada tamu.</p>
      ) : (
        <div className="space-y-2">
          {guests.map((guest) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 bg-spotify-bg rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{guest.name}</p>
                <p className="text-spotify-text text-xs">{guest.address}</p>
                <p className="text-spotify-text text-[10px] mt-0.5">
                  <a href={`/${eventSlug}/${guest.slug}`} target="_blank" rel="noreferrer" className="text-spotify-green hover:underline">
                    /{eventSlug}/{guest.slug}
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyLink(guest)}
                  className="text-spotify-text hover:text-spotify-green text-xs"
                  title="Copy link"
                >
                  Copy
                </button>
                <button
                  onClick={() => { setEditing(guest); setShowForm(true); }}
                  className="text-spotify-text hover:text-spotify-white text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(guest.id)}
                  className="text-red-500 hover:text-red-400 text-xs"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}