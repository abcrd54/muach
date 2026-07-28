import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { eventsRouter } from './routes/events.js';
import { guestsRouter } from './routes/guests.js';
import { rsvpRouter } from './routes/rsvp.js';
import { configRouter } from './routes/config.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/guests', guestsRouter);
app.use('/api/rsvp', rsvpRouter);
app.use('/api/config', configRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});