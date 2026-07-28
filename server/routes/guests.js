import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readGuests, writeGuests, slugify } from '../../lib/redis-store.mjs';

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export const guestsRouter = Router();

guestsRouter.get('/slug/:slug', async (req, res) => {
  const data = await readGuests();
  const guest = data.guests.find((g) => g.slug === req.params.slug);
  if (!guest) {
    return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  }
  res.json(guest);
});

guestsRouter.get('/', authMiddleware, async (req, res) => {
  const data = await readGuests();
  res.json(data.guests);
});

guestsRouter.post('/', authMiddleware, async (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json({ message: 'Nama dan alamat wajib diisi' });
  }
  const slug = slugify(`${name} ${address}`);
  const data = await readGuests();
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
  await writeGuests(data);
  res.status(201).json(guest);
});

guestsRouter.put('/:id', authMiddleware, async (req, res) => {
  const { name, address } = req.body;
  const data = await readGuests();
  const index = data.guests.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  }
  if (name) data.guests[index].name = name;
  if (address) data.guests[index].address = address;
  if (name || address) {
    data.guests[index].slug = slugify(`${data.guests[index].name} ${data.guests[index].address}`);
  }
  await writeGuests(data);
  res.json(data.guests[index]);
});

guestsRouter.delete('/:id', authMiddleware, async (req, res) => {
  const data = await readGuests();
  const index = data.guests.findIndex((g) => g.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  }
  data.guests.splice(index, 1);
  await writeGuests(data);
  res.json({ message: 'Tamu berhasil dihapus' });
});