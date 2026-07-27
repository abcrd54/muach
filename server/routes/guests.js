import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'data', 'guests.json');

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

function readData() {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify({ guests: [] }, null, 2));
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const guestsRouter = Router();

guestsRouter.get('/slug/:slug', (req, res) => {
  const data = readData();
  const guest = data.guests.find((g) => g.slug === req.params.slug);
  if (!guest) {
    return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  }
  res.json(guest);
});

guestsRouter.get('/', authMiddleware, (req, res) => {
  const data = readData();
  res.json(data.guests);
});

guestsRouter.post('/', authMiddleware, (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json({ message: 'Nama dan alamat wajib diisi' });
  }
  const slug = slugify(`${name} ${address}`);
  const data = readData();
  const existing = data.guests.filter((g) => g.slug === slug || g.slug.startsWith(`${slug}-`));
  const uniqueSlug = existing.length > 0 ? `${slug}-${existing.length + 1}` : slug;
  const guest = {
    id: uuidv4(),
    name,
    address,
    slug: uniqueSlug,
    createdAt: new Date().toISOString(),
  };
  data.guests.push(guest);
  writeData(data);
  res.status(201).json(guest);
});

guestsRouter.put('/:id', authMiddleware, (req, res) => {
  const { name, address } = req.body;
  const data = readData();
  const index = data.guests.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  }
  if (name) data.guests[index].name = name;
  if (address) data.guests[index].address = address;
  if (name || address) {
    data.guests[index].slug = slugify(`${data.guests[index].name} ${data.guests[index].address}`);
  }
  writeData(data);
  res.json(data.guests[index]);
});

guestsRouter.delete('/:id', authMiddleware, (req, res) => {
  const data = readData();
  const index = data.guests.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  }
  data.guests.splice(index, 1);
  writeData(data);
  res.json({ message: 'Tamu berhasil dihapus' });
});