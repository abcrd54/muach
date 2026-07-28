import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { readGuests, writeGuests, findGuestBySlug, slugify } from '../../lib/redis-store.mjs';

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) return res.status(401).json({ message: 'Unauthorized' });
  next();
}

export const guestsRouter = Router();

guestsRouter.get('/slug/:eventSlug/:guestSlug', async (req, res) => {
  const guest = await findGuestBySlug(req.params.eventSlug, req.params.guestSlug);
  if (!guest) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  res.json(guest);
});

guestsRouter.get('/', authMiddleware, async (req, res) => {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  const data = await readGuests(eventSlug);
  res.json(data.guests);
});

guestsRouter.post('/', authMiddleware, async (req, res) => {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  const { name, address } = req.body;
  if (!name || !address) return res.status(400).json({ message: 'Nama dan alamat wajib diisi' });
  const slug = slugify(`${name} ${address}`);
  const data = await readGuests(eventSlug);
  const existing = data.guests.filter((g) => g.slug === slug || g.slug.startsWith(`${slug}-`));
  const uniqueSlug = existing.length > 0 ? `${slug}-${existing.length + 1}` : slug;
  const guest = { id: uuidv4(), name, address, slug: uniqueSlug, eventSlug, createdAt: new Date().toISOString() };
  data.guests.push(guest);
  await writeGuests(eventSlug, data);
  res.status(201).json(guest);
});

guestsRouter.put('/:id', authMiddleware, async (req, res) => {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  const { name, address } = req.body;
  const data = await readGuests(eventSlug);
  const index = data.guests.findIndex((g) => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  if (name) data.guests[index].name = name;
  if (address) data.guests[index].address = address;
  if (name || address) {
    data.guests[index].slug = slugify(`${data.guests[index].name} ${data.guests[index].address}`);
  }
  await writeGuests(eventSlug, data);
  res.json(data.guests[index]);
});

guestsRouter.delete('/:id', authMiddleware, async (req, res) => {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  const data = await readGuests(eventSlug);
  const index = data.guests.findIndex((g) => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  data.guests.splice(index, 1);
  await writeGuests(eventSlug, data);
  res.json({ message: 'Tamu berhasil dihapus' });
});