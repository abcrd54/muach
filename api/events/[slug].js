const { listEvents, readEvent, writeEvent, deleteEvent, parseBody, json, authMiddleware } = require('../../_lib/data');

module.exports = async function handler(req, res) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    const event = await readEvent(slug);
    return json(res, event);
  }

  if (req.method === 'PUT') {
    if (!authMiddleware(req)) return json(res, { message: 'Unauthorized' }, 401);
    const body = await parseBody(req);
    const event = await readEvent(slug);
    const fields = [
      'coupleName1', 'coupleName2',
      'brideFullName', 'brideRole', 'brideFather', 'brideMother', 'bridePhoto', 'brideSocial',
      'groomFullName', 'groomRole', 'groomFather', 'groomMother', 'groomPhoto', 'groomSocial',
      'weddingDate', 'mapsLink', 'mapsEmbedUrl', 'venueName', 'venueAddress',
      'akadDate', 'akadTime',
      'resepsiDate', 'resepsiTime',
    ];
    for (const f of fields) {
      if (body[f] !== undefined) event[f] = body[f];
    }
    await writeEvent(slug, event);
    return json(res, event);
  }

  if (req.method === 'DELETE') {
    if (!authMiddleware(req)) return json(res, { message: 'Unauthorized' }, 401);
    try {
      await deleteEvent(slug);
      return json(res, { message: 'Event berhasil dihapus' });
    } catch (e) {
      console.error('deleteEvent error:', e.message || e);
      return json(res, { message: 'Gagal menghapus event' }, 500);
    }
  }

  return json(res, { message: 'Method not allowed' }, 405);
};