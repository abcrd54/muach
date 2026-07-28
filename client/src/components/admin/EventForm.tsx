import { useState, useEffect, useCallback, useRef } from 'react';
import { api, EventData } from '../../utils/api';

interface EventFormProps {
  token: string;
  eventSlug: string;
}

const EMPTY: EventData = {
  coupleName1: '', coupleName2: '',
  brideFullName: '', brideRole: 'Putra dari', brideFather: '', brideMother: '', bridePhoto: '', brideSocial: '',
  groomFullName: '', groomRole: 'Putri dari', groomFather: '', groomMother: '', groomPhoto: '', groomSocial: '',
  weddingDate: '', mapsLink: '', mapsEmbedUrl: '', venueName: '', venueAddress: '',
  akadDate: '', akadTime: '', resepsiDate: '', resepsiTime: '',
};

function genEmbedUrl(link: string): string {
  if (!link) return '';
  const m = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966!2d${m[2]}!3d${m[1]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!5e0!3m2!1sid!2sid!4v1`;
  return link;
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PhotoUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      onChange(dataUrl);
    } catch {} finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <label className="block text-spotify-text text-xs mb-1">{label}</label>
      <div className="flex items-center gap-2">
        {value && (
          <img src={value} alt="" className="w-10 h-10 rounded-full object-cover border border-[#404040]" />
        )}
        <input type="file" accept="image/*" ref={inputRef} onChange={handleFile} className="hidden" />
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="text-xs bg-spotify-surface border border-[#404040] rounded-lg px-3 py-1.5 text-spotify-text hover:border-spotify-green transition-colors disabled:opacity-50">
          {uploading ? 'Uploading...' : value ? 'Ganti Foto' : 'Upload Foto'}
        </button>
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-xs text-red-500 hover:text-red-400">Hapus</button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-spotify-text text-xs mb-1">{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-spotify-bg border border-[#404040] rounded-lg px-3 py-2 text-spotify-white text-sm focus:border-spotify-green focus:outline-none transition-colors" />
    </div>
  );
}

export default function EventForm({ token, eventSlug }: EventFormProps) {
  const [data, setData] = useState<EventData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventSlug) { setLoading(false); return; }
    setLoading(true);
    api.getEvent(eventSlug).then((d) => {
      const merged = { ...EMPTY, ...d };
      if (!merged.brideRole) merged.brideRole = 'Putra dari';
      if (!merged.groomRole) merged.groomRole = 'Putri dari';
      setData(merged);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [eventSlug]);

  const set = useCallback((field: keyof EventData, value: string) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'mapsLink') next.mapsEmbedUrl = genEmbedUrl(value);
      return next;
    });
  }, []);

  const handleSave = async () => {
    if (!eventSlug) return;
    setSaving(true);
    setMessage('');
    try {
      const updated = await api.updateEvent(token, eventSlug, data);
      setData(updated);
      setMessage('Data berhasil disimpan');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card-spotify mb-6"><p className="text-spotify-text">Loading data acara...</p></div>;
  if (!eventSlug) return <div className="card-spotify mb-6"><p className="text-spotify-text">Pilih event terlebih dahulu</p></div>;

  return (
    <div className="card-spotify mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Data Pengantin & Acara</h3>
        <div className="flex items-center gap-3">
          {message && <span className={`text-xs ${message.includes('berhasil') ? 'text-spotify-green' : 'text-red-500'}`}>{message}</span>}
          <button onClick={handleSave} disabled={saving} className="btn-spotify text-sm">{saving ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </div>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Nama Pengantin */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Nama Pengantin</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama Pengantin Pria" value={data.coupleName1} onChange={(v) => set('coupleName1', v)} placeholder="Alex" />
            <Field label="Nama Pengantin Wanita" value={data.coupleName2} onChange={(v) => set('coupleName2', v)} placeholder="Jessica" />
          </div>
        </div>

        {/* Mempelai Pria */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Mempelai Pria</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama Lengkap" value={data.brideFullName} onChange={(v) => set('brideFullName', v)} />
            <Field label="Status" value={data.brideRole} onChange={(v) => set('brideRole', v)} placeholder="Putra dari" />
            <Field label="Nama Bapak" value={data.brideFather} onChange={(v) => set('brideFather', v)} placeholder="Bpk. Ahmad" />
            <Field label="Nama Ibu" value={data.brideMother} onChange={(v) => set('brideMother', v)} placeholder="Ibu Siti" />
            <PhotoUpload label="Foto" value={data.bridePhoto} onChange={(v) => set('bridePhoto', v)} />
            <Field label="Social Media (opsional)" value={data.brideSocial} onChange={(v) => set('brideSocial', v)} placeholder="@alex" />
          </div>
        </div>

        {/* Mempelai Wanita */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Mempelai Wanita</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama Lengkap" value={data.groomFullName} onChange={(v) => set('groomFullName', v)} />
            <Field label="Status" value={data.groomRole} onChange={(v) => set('groomRole', v)} placeholder="Putri dari" />
            <Field label="Nama Bapak" value={data.groomFather} onChange={(v) => set('groomFather', v)} placeholder="Bpk. Budi" />
            <Field label="Nama Ibu" value={data.groomMother} onChange={(v) => set('groomMother', v)} placeholder="Ibu Dewi" />
            <PhotoUpload label="Foto" value={data.groomPhoto} onChange={(v) => set('groomPhoto', v)} />
            <Field label="Social Media (opsional)" value={data.groomSocial} onChange={(v) => set('groomSocial', v)} placeholder="@jessica" />
          </div>
        </div>

        {/* Tanggal */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Tanggal Pernikahan</h4>
          <Field label="Tanggal" value={data.weddingDate} onChange={(v) => set('weddingDate', v)} placeholder="12 Desember 2026" />
        </div>

        {/* Akad Nikah */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Akad Nikah</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tanggal" value={data.akadDate} onChange={(v) => set('akadDate', v)} placeholder="Sabtu, 12 Desember 2026" />
            <Field label="Waktu" value={data.akadTime} onChange={(v) => set('akadTime', v)} placeholder="08:00 - 10:00 WIB" />
          </div>
        </div>

        {/* Resepsi */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Resepsi</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tanggal" value={data.resepsiDate} onChange={(v) => set('resepsiDate', v)} placeholder="Sabtu, 12 Desember 2026" />
            <Field label="Waktu" value={data.resepsiTime} onChange={(v) => set('resepsiTime', v)} placeholder="11:00 - 17:00 WIB" />
          </div>
        </div>

        {/* Lokasi */}
        <div>
          <h4 className="text-spotify-green text-sm font-medium mb-3">Lokasi</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama Venue" value={data.venueName} onChange={(v) => set('venueName', v)} />
            <Field label="Alamat" value={data.venueAddress} onChange={(v) => set('venueAddress', v)} />
            <div className="col-span-2">
              <Field label="Google Maps Link" value={data.mapsLink} onChange={(v) => set('mapsLink', v)} placeholder="https://maps.app.goo.gl/..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}