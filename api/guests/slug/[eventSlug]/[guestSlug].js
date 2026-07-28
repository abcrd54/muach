const { findGuestBySlug, json } = require('../../../_lib/data');

module.exports = async function handler(req, res) {
  const { eventSlug, guestSlug } = req.query;
  if (req.method !== 'GET') return json(res, { message: 'Method not allowed' }, 405);

  const guest = await findGuestBySlug(eventSlug, guestSlug);
  if (!guest) return json(res, { message: 'Tamu tidak ditemukan' }, 404);
  return json(res, guest);
};