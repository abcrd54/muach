import { Router } from 'express';
import { readEvent, writeEvent } from '../../lib/redis-store.mjs';

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

export const eventRouter = Router();

eventRouter.get('/', async (req, res) => {
  res.json(await readEvent());
});

eventRouter.put('/', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
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
    if (req.body[f] !== undefined) event[f] = req.body[f];
  }
  await writeEvent(event);
  res.json(event);
});