const { readConfig, writeConfig, parseBody, json, authMiddleware } = require('../_lib/data');

module.exports = async function handler(req, res) {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return json(res, { message: 'eventSlug wajib diisi' }, 400);

  if (req.method === 'GET') {
    const config = await readConfig(eventSlug);
    return json(res, config);
  }

  if (req.method === 'PUT') {
    if (!authMiddleware(req)) return json(res, { message: 'Unauthorized' }, 401);
    const body = await parseBody(req);
    const config = await readConfig(eventSlug);
    if (body.theme) config.theme = body.theme;
    await writeConfig(eventSlug, config);
    return json(res, config);
  }

  return json(res, { message: 'Method not allowed' }, 405);
};