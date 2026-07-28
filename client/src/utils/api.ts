const API_BASE = '/api';

export interface Guest {
  id: string;
  name: string;
  address: string;
  slug: string;
  eventSlug?: string;
  createdAt: string;
}

export interface RSVPData {
  guestId: string;
  name: string;
  attendance: 'yes' | 'no' | 'maybe';
  message: string;
}

export interface RSVPItem extends RSVPData {
  createdAt: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const { headers: optHeaders, ...rest } = options || {};
  const res = await fetch(`${API_BASE}${url}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...optHeaders },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    const error = new Error(err.message || 'Request failed') as Error & { status: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export interface Config {
  theme: string;
}

export interface EventData {
  slug?: string;
  coupleName1: string;
  coupleName2: string;
  brideFullName: string;
  brideRole: string;
  brideParents: string;
  bridePhoto: string;
  brideSocial: string;
  groomFullName: string;
  groomRole: string;
  groomParents: string;
  groomPhoto: string;
  groomSocial: string;
  weddingDate: string;
  mapsEmbedUrl: string;
  mapsLink: string;
  venueName: string;
  venueAddress: string;
  akadTitle: string;
  akadDate: string;
  akadTime: string;
  resepsiTitle: string;
  resepsiDate: string;
  resepsiTime: string;
  createdAt?: string;
}

export const DEFAULT_EVENT: EventData = {
  coupleName1: 'Alex', coupleName2: 'Jessica',
  brideFullName: 'Alex', brideRole: 'Putra Pertama', brideParents: 'Bpk. Ahmad & Ibu Siti', bridePhoto: '/assets/images/couple-1.jpg', brideSocial: '@alex',
  groomFullName: 'Jessica', groomRole: 'Putri Kedua', groomParents: 'Bpk. Budi & Ibu Dewi', groomPhoto: '/assets/images/couple-2.jpg', groomSocial: '@jessica',
  weddingDate: '12 Desember 2026',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.487005123!2d106.689428!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e4b5b7%3A0x9a1a1b1c1d1e1f!2sJakarta!5e0!3m2!1sid!2sid!4v1234567890',
  mapsLink: 'https://maps.google.com', venueName: 'Gedung Serbaguna Harmoni', venueAddress: 'Jl. Melati No. 12, Jakarta Pusat',
  akadTitle: 'Akad Nikah', akadDate: 'Sabtu, 12 Desember 2026', akadTime: '08:00 - 10:00 WIB',
  resepsiTitle: 'Resepsi', resepsiDate: 'Sabtu, 12 Desember 2026', resepsiTime: '11:00 - 17:00 WIB',
};

export const api = {
  login: (password: string) =>
    request<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),

  // ─── Events ───

  getEvents: (token: string) =>
    request<EventData[]>('/events', { headers: { Authorization: `Bearer ${token}` } }),

  createEvent: (token: string, data: Partial<EventData>) =>
    request<EventData>('/events', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),

  getEvent: (eventSlug: string) =>
    request<EventData>(`/events/${eventSlug}`),

  updateEvent: (token: string, eventSlug: string, data: Partial<EventData>) =>
    request<EventData>(`/events/${eventSlug}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }),

  deleteEvent: (token: string, eventSlug: string) =>
    request<{ message: string }>(`/events/${eventSlug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),

  // ─── Config ───

  getConfig: (eventSlug: string) =>
    request<Config>(`/config?eventSlug=${eventSlug}`),

  updateConfig: (token: string, eventSlug: string, theme: string) =>
    request<Config>(`/config?eventSlug=${eventSlug}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ theme }) }),

  // ─── Guests ───

  getGuestBySlug: (eventSlug: string, guestSlug: string) =>
    request<Guest>(`/guests/slug/${eventSlug}/${guestSlug}`),

  getGuests: (token: string, eventSlug: string) =>
    request<Guest[]>(`/guests?eventSlug=${eventSlug}`, { headers: { Authorization: `Bearer ${token}` } }),

  addGuest: (token: string, eventSlug: string, name: string, address: string) =>
    request<Guest>(`/guests?eventSlug=${eventSlug}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, address }) }),

  updateGuest: (token: string, eventSlug: string, id: string, name: string, address: string) =>
    request<Guest>(`/guests/${id}?eventSlug=${eventSlug}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ name, address }) }),

  deleteGuest: (token: string, eventSlug: string, id: string) =>
    request<{ message: string }>(`/guests/${id}?eventSlug=${eventSlug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),

  // ─── RSVP ───

  submitRSVP: (eventSlug: string, data: RSVPData) =>
    request<{ message: string }>(`/rsvp?eventSlug=${eventSlug}`, { method: 'POST', body: JSON.stringify(data) }),

  getRSVPs: (eventSlug: string) =>
    request<RSVPItem[]>(`/rsvp?eventSlug=${eventSlug}`),
};