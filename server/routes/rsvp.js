import { Router } from 'express';
import { readRSVPs, writeRSVPs } from '../../lib/redis-store.mjs';

export const rsvpRouter = Router();

rsvpRouter.get('/', async (req, res) => {
  const data = await readRSVPs();
  res.json(data.rsvps || []);
});

rsvpRouter.post('/', async (req, res) => {
  const { guestId, name, attendance, message } = req.body;
  if (!guestId || !name || !attendance) {
    return res.status(400).json({ message: 'Guest ID, nama, dan kehadiran wajib diisi' });
  }
  if (!['yes', 'no', 'maybe'].includes(attendance)) {
    return res.status(400).json({ message: 'Status kehadiran tidak valid' });
  }
  const data = await readRSVPs();
  const existing = data.rsvps.find((r) => r.guestId === guestId);
  if (existing) {
    existing.name = name;
    existing.attendance = attendance;
    existing.message = message || '';
    existing.createdAt = new Date().toISOString();
  } else {
    data.rsvps.push({
      guestId,
      name,
      attendance,
      message: message || '',
      createdAt: new Date().toISOString(),
    });
  }
  await writeRSVPs(data);
  res.status(201).json({ message: 'Konfirmasi berhasil dikirim' });
});