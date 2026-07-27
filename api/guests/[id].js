const { readGuests, writeGuests, slugify, parseBody, json, authMiddleware } = require('../_lib/data');

module.exports = async function handler(req, res) {
  const { id } = req.query;
  const method = req.method;

  if (method === 'PUT') {
    if (!authMiddleware(req)) {
      return json(res, { message: 'Unauthorized' }, 401);
    }
    const { name, address } = await parseBody(req);
    const data = await readGuests();
    const index = data.guests.findIndex((g) => g.id === id);
    if (index === -1) {
      return json(res, { message: 'Tamu tidak ditemukan' }, 404);
    }
    if (name) data.guests[index].name = name;
    if (address) data.guests[index].address = address;
    if (name || address) {
      data.guests[index].slug = slugify(`${data.guests[index].name} ${data.guests[index].address}`);
    }
    await writeGuests(data);
    return json(res, data.guests[index]);
  }

  if (method === 'DELETE') {
    if (!authMiddleware(req)) {
      return json(res, { message: 'Unauthorized' }, 401);
    }
    const data = await readGuests();
    const index = data.guests.findIndex((g) => g.id === id);
    if (index === -1) {
      return json(res, { message: 'Tamu tidak ditemukan' }, 404);
    }
    data.guests.splice(index, 1);
    await writeGuests(data);
    return json(res, { message: 'Tamu berhasil dihapus' });
  }

  return json(res, { message: 'Method not allowed' }, 405);
};