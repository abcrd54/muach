import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { guestsRouter } from './routes/guests.js';
import { rsvpRouter } from './routes/rsvp.js';
import { configRouter } from './routes/config.js';
import { eventRouter } from './routes/event.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/guests', guestsRouter);
app.use('/api/rsvp', rsvpRouter);
app.use('/api/config', configRouter);
app.use('/api/event', eventRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});