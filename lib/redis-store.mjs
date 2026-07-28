let redis = null;

const REDIS_URL = process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;

if (REDIS_URL && REDIS_TOKEN) {
  try {
    const { Redis } = await import('@upstash/redis');
    redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
  } catch {
    redis = null;
  }
}

const isRedis = () => redis !== null;

const memoryStore = {
  guests: null,
  rsvps: null,
  config: null,
  event: null,
};

const DEFAULT_GUESTS = { guests: [] };
const DEFAULT_RSVPS = { rsvps: [] };
const DEFAULT_CONFIG = { theme: 'spotify' };
const DEFAULT_EVENT = {
  coupleName1: 'Alex',
  coupleName2: 'Jessica',
  brideFullName: 'Alex',
  brideRole: 'Putra Pertama',
  brideParents: 'Bpk. Ahmad & Ibu Siti',
  bridePhoto: '/assets/images/couple-1.jpg',
  brideSocial: '@alex',
  groomFullName: 'Jessica',
  groomRole: 'Putri Kedua',
  groomParents: 'Bpk. Budi & Ibu Dewi',
  groomPhoto: '/assets/images/couple-2.jpg',
  groomSocial: '@jessica',
  weddingDate: '12 Desember 2026',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253840.487005123!2d106.689428!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e4b5b7%3A0x9a1a1b1c1d1e1f!2sJakarta!5e0!3m2!1sid!2sid!4v1234567890',
  mapsLink: 'https://maps.google.com',
  venueName: 'Gedung Serbaguna Harmoni',
  venueAddress: 'Jl. Melati No. 12, Jakarta Pusat',
  akadTitle: 'Akad Nikah',
  akadDate: 'Sabtu, 12 Desember 2026',
  akadTime: '08:00 - 10:00 WIB',
  resepsiTitle: 'Resepsi',
  resepsiDate: 'Sabtu, 12 Desember 2026',
  resepsiTime: '11:00 - 17:00 WIB',
};

async function readFromRedis(key, fallback) {
  if (!isRedis()) return null;
  try {
    const data = await redis.get(key);
    if (data) return typeof data === 'string' ? JSON.parse(data) : data;
    const init = typeof fallback === 'function' ? fallback() : fallback;
    if (init) {
      await redis.set(key, JSON.stringify(init));
    }
    return init;
  } catch {
    return null;
  }
}

async function writeToRedis(key, data) {
  if (!isRedis()) return;
  try {
    await redis.set(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

async function getFromMemory(key, fallback) {
  if (memoryStore[key]) return memoryStore[key];
  const init = typeof fallback === 'function' ? fallback() : fallback;
  memoryStore[key] = init;
  return init;
}

function setInMemory(key, data) {
  memoryStore[key] = data;
}

export async function readGuests() {
  const redisData = await readFromRedis('guests', DEFAULT_GUESTS);
  if (redisData) return redisData;
  return getFromMemory('guests', DEFAULT_GUESTS);
}

export async function writeGuests(data) {
  setInMemory('guests', data);
  await writeToRedis('guests', data);
}

export async function readRSVPs() {
  const redisData = await readFromRedis('rsvps', DEFAULT_RSVPS);
  if (redisData) return redisData;
  return getFromMemory('rsvps', DEFAULT_RSVPS);
}

export async function writeRSVPs(data) {
  setInMemory('rsvps', data);
  await writeToRedis('rsvps', data);
}

export async function readConfig() {
  const redisData = await readFromRedis('config', DEFAULT_CONFIG);
  if (redisData) return redisData;
  return getFromMemory('config', DEFAULT_CONFIG);
}

export async function writeConfig(data) {
  setInMemory('config', data);
  await writeToRedis('config', data);
}

export async function readEvent() {
  const redisData = await readFromRedis('event', DEFAULT_EVENT);
  if (redisData) return redisData;
  return getFromMemory('event', DEFAULT_EVENT);
}

export async function writeEvent(data) {
  setInMemory('event', data);
  await writeToRedis('event', data);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'IkiJeporo1954';
export const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';