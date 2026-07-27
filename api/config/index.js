const { readConfig, writeConfig, parseBody, json, authMiddleware } = require('../_lib/data');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const config = await readConfig();
    return json(res, config);
  }

  if (req.method === 'PUT') {
    if (!authMiddleware(req)) {
      return json(res, { message: 'Unauthorized' }, 401);
    }
    const body = await parseBody(req);
    const config = await readConfig();
    if (body.theme) config.theme = body.theme;
    await writeConfig(config);
    return json(res, config);
  }

  json(res, { message: 'Method not allowed' }, 405);
};