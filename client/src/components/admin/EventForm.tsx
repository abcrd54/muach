import { useState, useEffect, useCallback } from 'react';
import { api, EventData } from '../../utils/api';

interface EventFormProps {
  token: string;
}

const EMPTY: EventData = {
  coupleName1: '', coupleName2: '',
  brideFullName: '', brideRole: '', brideParents: '', bridePhoto: '', brideSocial: '',
  groomFullName: '', groomRole: '', groomParents: '', groomPhoto: '', groomSocial: '',
  weddingDate: '',
  mapsEmbedUrl: '', mapsLink: '', venueName: '', venueAddress: '',
  akadTitle: '', akadDate: '', akadTime: '',
  resepsiTitle: '', resepsiDate: '', resepsiTime: '',
};

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-spotify-text text-xs mb-1">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-spotify-bg border border-[#404040] rounded-lg px-3 py-2 text-spotify-white text-sm focus:border-spotify-green focus:outline-none transition-colors"
      />
    </div>
  );
}

export default function EventForm({ token }: EventFormProps) {
  const [data, setData] = useState<EventData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEvent().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = useCallback((field: keyof EventData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const updated = await api.updateEvent(token, data);
      setData(updated);
      setMessage('Data berhasil disimpan');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card-spotify mb-6">
        <p className="text-spotify-text">Loading data acara...</p>
      </div>
    );
  }

  return (
    <div className="card-spotify mb-6">
      <h3 className="text-lg font-semibold mb-4">Data Pengantin & Acara</h3>

      <div className="space-y-6">
        {/* Couple Names */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Nama Pengantin</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nama Pengantin 1 (Pria)" value={data.coupleName1} onChange={(v) => handleChange('coupleName1', v)} />
            <FormField label="Nama Pengantin 2 (Wanita)" value={data.coupleName2} onChange={(v) => handleChange('coupleName2', v)} />
          </div>
        </div>

        {/* Bride */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Data Mempelai Pria</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nama Lengkap" value={data.brideFullName} onChange={(v) => handleChange('brideFullName', v)} />
            <FormField label="Status (Putra ke-)" value={data.brideRole} onChange={(v) => handleChange('brideRole', v)} />
            <FormField label="Orang Tua" value={data.brideParents} onChange={(v) => handleChange('brideParents', v)} />
            <FormField label="URL Foto" value={data.bridePhoto} onChange={(v) => handleChange('bridePhoto', v)} />
            <FormField label="Social Media" value={data.brideSocial} onChange={(v) => handleChange('brideSocial', v)} />
          </div>
        </div>

        {/* Groom */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Data Mempelai Wanita</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nama Lengkap" value={data.groomFullName} onChange={(v) => handleChange('groomFullName', v)} />
            <FormField label="Status (Putri ke-)" value={data.groomRole} onChange={(v) => handleChange('groomRole', v)} />
            <FormField label="Orang Tua" value={data.groomParents} onChange={(v) => handleChange('groomParents', v)} />
            <FormField label="URL Foto" value={data.groomPhoto} onChange={(v) => handleChange('groomPhoto', v)} />
            <FormField label="Social Media" value={data.groomSocial} onChange={(v) => handleChange('groomSocial', v)} />
          </div>
        </div>

        {/* Date */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Tanggal</h4>
          <FormField label="Tanggal Pernikahan" value={data.weddingDate} onChange={(v) => handleChange('weddingDate', v)} />
        </div>

        {/* Akad */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Akad Nikah</h4>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Judul" value={data.akadTitle} onChange={(v) => handleChange('akadTitle', v)} />
            <FormField label="Tanggal" value={data.akadDate} onChange={(v) => handleChange('akadDate', v)} />
            <FormField label="Waktu" value={data.akadTime} onChange={(v) => handleChange('akadTime', v)} />
          </div>
        </div>

        {/* Resepsi */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Resepsi</h4>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Judul" value={data.resepsiTitle} onChange={(v) => handleChange('resepsiTitle', v)} />
            <FormField label="Tanggal" value={data.resepsiDate} onChange={(v) => handleChange('resepsiDate', v)} />
            <FormField label="Waktu" value={data.resepsiTime} onChange={(v) => handleChange('resepsiTime', v)} />
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Lokasi</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nama Venue" value={data.venueName} onChange={(v) => handleChange('venueName', v)} />
            <FormField label="Alamat" value={data.venueAddress} onChange={(v) => handleChange('venueAddress', v)} />
            <FormField label="Google Maps Embed URL" value={data.mapsEmbedUrl} onChange={(v) => handleChange('mapsEmbedUrl', v)} />
            <FormField label="Google Maps Link" value={data.mapsLink} onChange={(v) => handleChange('mapsLink', v)} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={handleSave} disabled={saving} className="btn-spotify text-sm">
          {saving ? 'Menyimpan...' : 'Simpan Data Acara'}
        </button>
        {message && (
          <span className={`text-sm ${message.includes('berhasil') ? 'text-spotify-green' : 'text-red-500'}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}