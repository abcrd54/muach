import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '../../utils/api';

const THEMES = [
  { id: 'spotify', name: 'Spotify Dark', description: 'Modern dark dengan aksen hijau', bg: '#121212', primary: '#1DB954', text: '#b3b3b3' },
  { id: 'serenade', name: 'Serenade Moss', description: 'Elegant luxury dengan nuansa hijau gelap', bg: '#1A1F1C', primary: '#B8A06E', text: '#C4C4B8' },
  { id: 'tema3', name: 'Golden Amber', description: 'Warm elegant dengan nuansa emas & krem', bg: '#fffbeb', primary: '#C79031', text: '#374151' },
];

interface ThemeSelectorProps {
  token: string;
  eventSlug: string;
}

export default function ThemeSelector({ token, eventSlug }: ThemeSelectorProps) {
  const [selected, setSelected] = useState('spotify');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!eventSlug) return;
    api.getConfig(eventSlug).then((c) => setSelected(c.theme)).catch(() => {});
  }, [eventSlug]);

  const handleSave = async () => {
    if (!eventSlug) return;
    setSaving(true);
    setMessage('');
    try {
      await api.updateConfig(token, eventSlug, selected);
      document.documentElement.setAttribute('data-theme', selected);
      setMessage('Tema berhasil disimpan');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Gagal menyimpan tema');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card-spotify mb-6">
      <h3 className="text-lg font-semibold mb-4">Pilih Tema Undangan</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {THEMES.map((theme) => (
          <motion.button
            key={theme.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(theme.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${selected === theme.id ? 'border-spotify-green bg-spotify-green/10' : 'border-transparent bg-spotify-surface hover:border-[#404040]'}`}
          >
            <div className="flex gap-2 mb-3">
              <div className="w-6 h-6 rounded-full" style={{ background: theme.primary }} />
              <div className="w-6 h-6 rounded-full" style={{ background: theme.bg }} />
              <div className="w-6 h-6 rounded-full" style={{ background: theme.text }} />
            </div>
            <p className="font-semibold text-sm">{theme.name}</p>
            <p className="text-spotify-text text-xs mt-1">{theme.description}</p>
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving || !eventSlug} className="btn-spotify text-sm">{saving ? 'Menyimpan...' : 'Simpan Tema'}</button>
        {message && <span className={`text-sm ${message.includes('berhasil') ? 'text-spotify-green' : 'text-red-500'}`}>{message}</span>}
      </div>
    </div>
  );
}