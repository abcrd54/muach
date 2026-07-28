const { listEvents, readEvent, writeEvent, parseBody, json, authMiddleware } = require('../_lib/data');

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
      const { writeToRedis, setInMemory, memoryStore } = require('../_lib/data');
      const events = await listEvents();
      const idx = events.indexOf(slug);
      if (idx !== -1) {
        events.splice(idx, 1);
        await writeToRedis('events:list', events);
        setInMemory('events:list', events);
      }
      await writeToRedis('event:' + slug, null);
      await writeToRedis('event:' + slug + ':config', null);
      await writeToRedis('event:' + slug + ':guests', null);
      await writeToRedis('event:' + slug + ':rsvps', null);
      delete memoryStore['event:' + slug];
      delete memoryStore['event:' + slug + ':config'];
      delete memoryStore['event:' + slug + ':guests'];
      delete memoryStore['event:' + slug + ':rsvps'];
      return json(res, { message: 'Event berhasil dihapus' });
    } catch (e) {
      return json(res, { message: e.message || String(e) }, 500);
    }
  }

  return json(res, { message: 'Method not allowed' }, 405);
};