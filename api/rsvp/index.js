const { readRSVPs, writeRSVPs, parseBody, json } = require('../_lib/data');

module.exports = async function handler(req, res) {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return json(res, { message: 'eventSlug wajib diisi' }, 400);

  if (req.method === 'GET') {
    const data = await readRSVPs(eventSlug);
    return json(res, data.rsvps || []);
  }

  if (req.method !== 'POST') return json(res, { message: 'Method not allowed' }, 405);

  const { guestId, name, attendance, message } = await parseBody(req);
  if (!guestId || !name || !attendance) return json(res, { message: 'Guest ID, nama, dan kehadiran wajib diisi' }, 400);
  if (!['yes', 'no', 'maybe'].includes(attendance)) return json(res, { message: 'Status kehadiran tidak valid' }, 400);

  const data = await readRSVPs(eventSlug);
  const existing = data.rsvps.find((r) => r.guestId === guestId);
  if (existing) {
    existing.name = name; existing.attendance = attendance; existing.message = message || ''; existing.createdAt = new Date().toISOString();
  } else {
    data.rsvps.push({ guestId, name, attendance, message: message || '', createdAt: new Date().toISOString() });
  }
  await writeRSVPs(eventSlug, data);
  return json(res, { message: 'Konfirmasi berhasil dikirim' }, 201);
};