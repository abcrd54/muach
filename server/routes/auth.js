import { Router } from 'express';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'IkiJeporo1954';
const SECRET_TOKEN = process.env.AUTH_TOKEN || 'undang-digi-admin-token-2024';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: SECRET_TOKEN });
  } else {
    res.status(401).json({ message: 'Password salah' });
  }
});