const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

let redis = null;
const REDIS_URL = process.env.REDIS_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;

if (REDIS_URL && REDIS_TOKEN) {
  const { Redis } = require('@upstash/redis');
  redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
}

const isRedis = () => redis !== null;

const DATA_DIR = join('/tmp', 'undang-digi-data');
const GUESTS_FILE = join(DATA_DIR, 'guests.json');
const RSVPS_FILE = join(DATA_DIR, 'rsvps.json');

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialData() {
  const seedFile = join(__dirname, '..', '..', 'data', 'guests.json');
  if (existsSync(seedFile)) {
    return JSON.parse(readFileSync(seedFile, 'utf-8'));
  }
  return { guests: [] };
}

async function readGuests() {
  if (isRedis()) {
    const data = await redis.get('guests');
    if (data) return typeof data === 'string' ? JSON.parse(data) : data;
    const initial = getInitialData();
    await redis.set('guests', JSON.stringify(initial));
    return initial;
  }
  ensureDataDir();
  if (existsSync(GUESTS_FILE)) {
    return JSON.parse(readFileSync(GUESTS_FILE, 'utf-8'));
  }
  const initial = getInitialData();
  writeFileSync(GUESTS_FILE, JSON.stringify(initial, null, 2));
  return initial;
}

async function writeGuests(data) {
  if (isRedis()) {
    await redis.set('guests', JSON.stringify(data));
    return;
  }
  ensureDataDir();
  writeFileSync(GUESTS_FILE, JSON.stringify(data, null, 2));
}

async function readRSVPs() {
  if (isRedis()) {
    const data = await redis.get('rsvps');
    if (data) return typeof data === 'string' ? JSON.parse(data) : data;
    await redis.set('rsvps', JSON.stringify({ rsvps: [] }));
    return { rsvps: [] };
  }
  ensureDataDir();
  if (existsSync(RSVPS_FILE)) {
    return JSON.parse(readFileSync(RSVPS_FILE, 'utf-8'));
  }
  writeFileSync(RSVPS_FILE, JSON.stringify({ rsvps: [] }, null, 2));
  return { rsvps: [] };
}

async function writeRSVPs(data) {
  if (isRedis()) {
    await redis.set('rsvps', JSON.stringify(data));
    return;
  }
  ensureDataDir();
  writeFileSync(RSVPS_FILE, JSON.stringify(data, null, 2));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'IkiJeporo1954';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body) return resolve(req.body);
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

function json(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function authMiddleware(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  return token === AUTH_TOKEN;
}

const CONFIG_FILE = join(DATA_DIR, 'config.json');
const EVENT_FILE = join(DATA_DIR, 'event.json');

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

async function readConfig() {
  if (isRedis()) {
    const data = await redis.get('config');
    if (data) return typeof data === 'string' ? JSON.parse(data) : data;
    await redis.set('config', JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
  ensureDataDir();
  if (existsSync(CONFIG_FILE)) {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
  return DEFAULT_CONFIG;
}

async function writeConfig(data) {
  if (isRedis()) {
    await redis.set('config', JSON.stringify(data));
    return;
  }
  ensureDataDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

async function readEvent() {
  if (isRedis()) {
    const data = await redis.get('event');
    if (data) return typeof data === 'string' ? JSON.parse(data) : data;
    await redis.set('event', JSON.stringify(DEFAULT_EVENT));
    return DEFAULT_EVENT;
  }
  ensureDataDir();
  if (existsSync(EVENT_FILE)) {
    return JSON.parse(readFileSync(EVENT_FILE, 'utf-8'));
  }
  writeFileSync(EVENT_FILE, JSON.stringify(DEFAULT_EVENT, null, 2));
  return DEFAULT_EVENT;
}

async function writeEvent(data) {
  if (isRedis()) {
    await redis.set('event', JSON.stringify(data));
    return;
  }
  ensureDataDir();
  writeFileSync(EVENT_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  readGuests, writeGuests, readRSVPs, writeRSVPs,
  readConfig, writeConfig, readEvent, writeEvent,
  slugify, ADMIN_PASSWORD, AUTH_TOKEN,
  parseBody, json, authMiddleware,
};