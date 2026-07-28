import { Router } from 'express';
import { readConfig, writeConfig } from '../../lib/redis-store.mjs';

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

export const configRouter = Router();

configRouter.get('/', async (req, res) => {
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  res.json(await readConfig(eventSlug));
});

configRouter.put('/', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) return res.status(401).json({ message: 'Unauthorized' });
  const eventSlug = req.query.eventSlug;
  if (!eventSlug) return res.status(400).json({ message: 'eventSlug wajib diisi' });
  const config = await readConfig(eventSlug);
  if (req.body.theme) config.theme = req.body.theme;
  await writeConfig(eventSlug, config);
  res.json(config);
});