import { Router } from 'express';
import { readRSVPs, writeRSVPs } from '../../lib/redis-store.mjs';

export const rsvpRouter = Router();

rsvpRouter.get('/', async (req, res) => {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  const data = await readRSVPs(eventSlug);
  res.json(data.rsvps || []);
});

rsvpRouter.post('/', async (req, res) => {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  const { guestId, name, attendance, message } = req.body;
  if (!guestId || !name || !attendance) return res.status(400).json({ message: 'Guest ID, nama, dan kehadiran wajib diisi' });
  if (!['yes', 'no', 'maybe'].includes(attendance)) return res.status(400).json({ message: 'Status kehadiran tidak valid' });
  const data = await readRSVPs(eventSlug);
  const existing = data.rsvps.find((r) => r.guestId === guestId);
  if (existing) {
    existing.name = name; existing.attendance = attendance; existing.message = message || ''; existing.createdAt = new Date().toISOString();
  } else {
    data.rsvps.push({ guestId, name, attendance, message: message || '', createdAt: new Date().toISOString() });
  }
  await writeRSVPs(eventSlug, data);
  res.status(201).json({ message: 'Konfirmasi berhasil dikirim' });
});