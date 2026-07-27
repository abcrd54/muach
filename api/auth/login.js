const { ADMIN_PASSWORD, AUTH_TOKEN, parseBody, json } = require('../_lib/data');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, { message: 'Method not allowed' }, 405);
  }

  const { password } = await parseBody(req);

  if (password === ADMIN_PASSWORD) {
    return json(res, { token: AUTH_TOKEN });
  }

  return json(res, { message: 'Password salah' }, 401);
};