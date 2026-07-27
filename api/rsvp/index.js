const { readRSVPs, writeRSVPs, parseBody, json } = require('../_lib/data');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await readRSVPs();
    return json(res, data.rsvps || []);
  }

  if (req.method !== 'POST') {
    return json(res, { message: 'Method not allowed' }, 405);
  }

  const { guestId, name, attendance, message } = await parseBody(req);

  if (!guestId || !name || !attendance) {
    return json(res, { message: 'Guest ID, nama, dan kehadiran wajib diisi' }, 400);
  }
  if (!['yes', 'no', 'maybe'].includes(attendance)) {
    return json(res, { message: 'Status kehadiran tidak valid' }, 400);
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

  return json(res, { message: 'Konfirmasi berhasil dikirim' }, 201);
};