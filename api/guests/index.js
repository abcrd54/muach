const { v4: uuidv4 } = require('uuid');
const { readGuests, writeGuests, slugify, parseBody, json, authMiddleware } = require('../_lib/data');

module.exports = async function handler(req, res) {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return json(res, { message: 'eventSlug wajib diisi' }, 400);

  if (req.method === 'GET') {
    if (!authMiddleware(req)) return json(res, { message: 'Unauthorized' }, 401);
    const data = await readGuests(eventSlug);
    return json(res, data.guests);
  }

  if (req.method === 'POST') {
    if (!authMiddleware(req)) return json(res, { message: 'Unauthorized' }, 401);
    const { name, address } = await parseBody(req);
    if (!name || !address) return json(res, { message: 'Nama dan alamat wajib diisi' }, 400);
    const slug = slugify(`${name} ${address}`);
    const data = await readGuests(eventSlug);
    const existing = data.guests.filter((g) => g.slug === slug || g.slug.startsWith(`${slug}-`));
    const uniqueSlug = existing.length > 0 ? `${slug}-${existing.length + 1}` : slug;
    const guest = { id: uuidv4(), name, address, slug: uniqueSlug, eventSlug, createdAt: new Date().toISOString() };
    data.guests.push(guest);
    await writeGuests(eventSlug, data);
    return json(res, guest, 201);
  }

  return json(res, { message: 'Method not allowed' }, 405);
};