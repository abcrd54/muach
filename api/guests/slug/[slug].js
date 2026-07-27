const { readGuests, json } = require('../../_lib/data');

module.exports = async function handler(req, res) {
  const { slug } = req.query;

  if (req.method !== 'GET') {
    return json(res, { message: 'Method not allowed' }, 405);
  }

  const data = await readGuests();
  const guest = data.guests.find((g) => g.slug === slug);

  if (!guest) {
    return json(res, { message: 'Tamu tidak ditemukan' }, 404);
  }

  return json(res, guest);
};