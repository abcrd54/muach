import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENT_FILE = join(__dirname, '..', 'data', 'event.json');

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

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

function readEvent() {
  if (!existsSync(EVENT_FILE)) {
    writeFileSync(EVENT_FILE, JSON.stringify(DEFAULT_EVENT, null, 2));
  }
  return JSON.parse(readFileSync(EVENT_FILE, 'utf-8'));
}

function writeEvent(data) {
  writeFileSync(EVENT_FILE, JSON.stringify(data, null, 2));
}

export const eventRouter = Router();

eventRouter.get('/', (req, res) => {
  res.json(readEvent());
});

eventRouter.put('/', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const event = readEvent();
  const fields = [
    'coupleName1', 'coupleName2',
    'brideFullName', 'brideRole', 'brideParents', 'bridePhoto', 'brideSocial',
    'groomFullName', 'groomRole', 'groomParents', 'groomPhoto', 'groomSocial',
    'weddingDate',
    'mapsEmbedUrl', 'mapsLink', 'venueName', 'venueAddress',
    'akadTitle', 'akadDate', 'akadTime',
    'resepsiTitle', 'resepsiDate', 'resepsiTime',
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined) event[f] = req.body[f];
  }
  writeEvent(event);
  res.json(event);
});