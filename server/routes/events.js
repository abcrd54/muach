import { Router } from 'express';
import { listEvents, createEvent, readEvent, writeEvent, deleteEvent } from '../../lib/redis-store.mjs';

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) return res.status(401).json({ message: 'Unauthorized' });
  next();
}

export const eventsRouter = Router();

eventsRouter.get('/', authMiddleware, async (req, res) => {
  const slugs = await listEvents();
  const result = [];
  for (const slug of slugs) {
    const event = await readEvent(slug);
    result.push(event);
  }
  res.json(result);
});

eventsRouter.post('/', authMiddleware, async (req, res) => {
  const { coupleName1, coupleName2 } = req.body;
  if (!coupleName1 || !coupleName2) return res.status(400).json({ message: 'coupleName1 dan coupleName2 wajib diisi' });
  const event = await createEvent(req.body);
  res.status(201).json(event);
});

eventsRouter.get('/:slug', async (req, res) => {
  res.json(await readEvent(req.params.slug));
});

eventsRouter.put('/:slug', authMiddleware, async (req, res) => {
  const event = await readEvent(req.params.slug);
  const fields = [
    'coupleName1', 'coupleName2', 'brideFullName', 'brideRole', 'brideParents', 'bridePhoto', 'brideSocial',
    'groomFullName', 'groomRole', 'groomParents', 'groomPhoto', 'groomSocial',
    'weddingDate', 'mapsEmbedUrl', 'mapsLink', 'venueName', 'venueAddress',
    'akadTitle', 'akadDate', 'akadTime', 'resepsiTitle', 'resepsiDate', 'resepsiTime',
  ];
  for (const f of fields) { if (req.body[f] !== undefined) event[f] = req.body[f]; }
  await writeEvent(req.params.slug, event);
  res.json(event);
});

eventsRouter.delete('/:slug', authMiddleware, async (req, res) => {
  await deleteEvent(req.params.slug);
  res.json({ message: 'Event berhasil dihapus' });
});