const { listEvents, readEvent, writeEvent, parseBody, json, authMiddleware } = require('../../_lib/data');

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
    return json(res, { message: 'DELETE endpoint reached' });
  }

  return json(res, { message: 'Method not allowed' }, 405);
};