import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { api, Guest } from '../../utils/api';
import GuestForm from './GuestForm';

interface GuestListProps {
  token: string;
  onLogout: () => void;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function GuestList({ token, onLogout }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);
  const [coupleSlug, setCoupleSlug] = useState('alex-dan-jessica');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const copyTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const msgTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    api.getEvent().then((event) => {
      setCoupleSlug(slugify(`${event.coupleName1} dan ${event.coupleName2}`));
    }).catch(() => {});
  }, []);

  const fetchGuests = useCallback(async () => {
    try {
      const data = await api.getGuests(token);
      setGuests(data);
    } catch (err: any) {
      if (err?.status === 401) {
        onLogout();
      } else {
        setError('Gagal memuat data tamu');
      }
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus tamu ini?')) return;
    try {
      await api.deleteGuest(token, id);
      setGuests((prev) => prev.filter((g) => g.id !== id));
      setError('');
    } catch {
      setError('Gagal menghapus tamu');
    }
  };

  const handleCopyLink = (guest: Guest) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/${coupleSlug}/${guest.slug}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        setCopiedId(guest.id);
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => setCopiedId(null), 2000);
      }).catch(() => {});
    }
  };

  const handleCopyMessage = (guest: Guest) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/${coupleSlug}/${guest.slug}`;
    const message = `Assalamu'alaikum Bapak/Ibu/Saudara/i ${guest.name}

Tanpa mengurangi rasa hormat, kami mengundang ${guest.name} di ${guest.address} untuk menghadiri acara pernikahan kami.

Berikut link undangan digital:
${link}

Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir.

Terima kasih.`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(message).then(() => {
        setCopiedMsg(guest.id);
        if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
        msgTimerRef.current = setTimeout(() => setCopiedMsg(null), 2000);
      }).catch(() => {});
    }
  };

  const handleSaved = () => {
    setEditingGuest(null);
    fetchGuests();
  };

  return (
    <>
      <GuestForm
        token={token}
        editingGuest={editingGuest}
        onSaved={handleSaved}
        onCancel={() => setEditingGuest(null)}
      />

      <div className="card-spotify">
        <h3 className="text-lg font-semibold mb-4">
          Daftar Tamu ({guests.length})
        </h3>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {loading ? (
          <p className="text-spotify-text">Loading...</p>
        ) : guests.length === 0 ? (
          <p className="text-spotify-text">Belum ada tamu. Tambahkan tamu di atas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-spotify-text text-sm border-b border-[#404040]">
                  <th className="pb-3 font-medium">Nama</th>
                  <th className="pb-3 font-medium">Alamat</th>
                  <th className="pb-3 font-medium">Link / Pesan</th>
                  <th className="pb-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-[#222] hover:bg-[#333] transition-colors"
                  >
                    <td className="py-3 font-medium">{guest.name}</td>
                    <td className="py-3 text-spotify-text">{guest.address}</td>
                    <td className="py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCopyLink(guest)}
                          className="text-spotify-green hover:text-spotify-green-hover text-sm transition-colors"
                        >
                          {copiedId === guest.id ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button
                          onClick={() => handleCopyMessage(guest)}
                          className="text-spotify-green hover:text-spotify-green-hover text-sm transition-colors"
                        >
                          {copiedMsg === guest.id ? 'Copied!' : 'Copy Pesan'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="text-spotify-text hover:text-spotify-white transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          className="text-red-500 hover:text-red-400 transition-colors text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}