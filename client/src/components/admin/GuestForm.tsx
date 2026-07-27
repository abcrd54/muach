import { useState, useEffect } from 'react';
import { api, Guest } from '../../utils/api';

interface GuestFormProps {
  token: string;
  editingGuest: Guest | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function GuestForm({ token, editingGuest, onSaved, onCancel }: GuestFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGuest) {
      setName(editingGuest.name);
      setAddress(editingGuest.address);
    } else {
      setName('');
      setAddress('');
    }
  }, [editingGuest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !address.trim()) {
      setError('Nama dan alamat wajib diisi');
      return;
    }
    setLoading(true);
    try {
      if (editingGuest) {
        await api.updateGuest(token, editingGuest.id, name, address);
      } else {
        await api.addGuest(token, name, address);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-spotify mb-6">
      <h3 className="text-lg font-semibold text-spotify-green mb-4">
        {editingGuest ? 'Edit Tamu' : 'Tambah Tamu Baru'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-spotify-text mb-1">Nama Tamu</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-spotify-bg border border-[#404040] rounded-lg px-4 py-3 text-spotify-white placeholder-spotify-text-secondary focus:outline-none focus:border-spotify-green transition-colors"
            placeholder="Riski Ridho"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-spotify-text mb-1">Alamat / Kota</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-spotify-bg border border-[#404040] rounded-lg px-4 py-3 text-spotify-white placeholder-spotify-text-secondary focus:outline-none focus:border-spotify-green transition-colors"
            placeholder="Solo"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-spotify flex-1 disabled:opacity-50">
            {loading ? 'Menyimpan...' : editingGuest ? 'Update' : 'Tambah'}
          </button>
          {editingGuest && (
            <button type="button" onClick={onCancel} className="btn-outline">
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}