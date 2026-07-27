const { readEvent, writeEvent, parseBody, json, authMiddleware } = require('../_lib/data');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const event = await readEvent();
    return json(res, event);
  }

  if (req.method === 'PUT') {
    if (!authMiddleware(req)) {
      return json(res, { message: 'Unauthorized' }, 401);
    }
    const body = await parseBody(req);
    const event = await readEvent();
    const fields = [
      'coupleName1', 'coupleName2',
      'brideFullName', 'brideRole', 'brideParents', 'bridePhoto', 'brideSocial',
      'groomFullName', 'groomRole', 'groomParents', 'groomPhoto', 'groomSocial',
      'weddingDate',
      'mapsEmbedUrl', 'mapsLink', 'venueName', 'venueAddress',
      'akadTitle', 'akadDate', 'akadTime',
      'resepsiTitle', 'resepsiDate', 'resepsiTime',
    ];
    for (const f of fields) {
      if (body[f] !== undefined) event[f] = body[f];
    }
    await writeEvent(event);
    return json(res, event);
  }

  json(res, { message: 'Method not allowed' }, 405);
};