import { Router } from 'express';
import { requireAuth } from '../middleware/jwtMiddleware';

const router = Router();

router.get('/api/me', requireAuth, (req, res) => {
  res.json(req.user);
});

export default router;