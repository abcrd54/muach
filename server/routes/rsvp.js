import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '..', 'data', 'rsvps.json');

function readData() {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify({ rsvps: [] }, null, 2));
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const rsvpRouter = Router();

rsvpRouter.get('/', (req, res) => {
  const data = readData();
  res.json(data.rsvps || []);
});

rsvpRouter.post('/', (req, res) => {
  const { guestId, name, attendance, message } = req.body;
  if (!guestId || !name || !attendance) {
    return res.status(400).json({ message: 'Guest ID, nama, dan kehadiran wajib diisi' });
  }
  if (!['yes', 'no', 'maybe'].includes(attendance)) {
    return res.status(400).json({ message: 'Status kehadiran tidak valid' });
  }
  const data = readData();
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
  writeData(data);
  res.status(201).json({ message: 'Konfirmasi berhasil dikirim' });
});