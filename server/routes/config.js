import { Router } from 'express';
import { readConfig, writeConfig } from '../../lib/redis-store.mjs';

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

export const configRouter = Router();

configRouter.get('/', async (req, res) => {
  res.json(await readConfig());
});

configRouter.put('/', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const config = await readConfig();
  if (req.body.theme) config.theme = req.body.theme;
  await writeConfig(config);
  res.json(config);
});