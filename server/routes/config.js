import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = join(__dirname, '..', 'data', 'config.json');

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

function readConfig() {
  if (!existsSync(CONFIG_FILE)) {
    writeFileSync(CONFIG_FILE, JSON.stringify({ theme: 'spotify' }, null, 2));
  }
  return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
}

function writeConfig(data) {
  writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

export const configRouter = Router();

configRouter.get('/', (req, res) => {
  res.json(readConfig());
});

configRouter.put('/', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== AUTH_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const config = readConfig();
  if (req.body.theme) config.theme = req.body.theme;
  writeConfig(config);
  res.json(config);
});