const { listEvents, createEvent, parseBody, json, authMiddleware } = require('../_lib/data');

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    if (!authMiddleware(req)) return json(res, { message: 'Unauthorized' }, 401);
    const events = await listEvents();
    const result = [];
    for (const slug of events) {
      const { readEvent } = require('../_lib/data');
      const event = await readEvent(slug);
      result.push(event);
    }
    return json(res, result);
  }

  if (req.method === 'POST') {
    if (!authMiddleware(req)) return json(res, { message: 'Unauthorized' }, 401);
    const body = await parseBody(req);
    if (!body.coupleName1 || !body.coupleName2) {
      return json(res, { message: 'coupleName1 dan coupleName2 wajib diisi' }, 400);
    }
    const event = await createEvent(body);
    return json(res, event, 201);
  }

  return json(res, { message: 'Method not allowed' }, 405);
};