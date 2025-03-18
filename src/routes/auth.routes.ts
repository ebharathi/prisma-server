// src/routes/auth.routes.ts
import { Router } from 'express';
import { signup, login, confirmEmail } from '../controllers/auth.controller';
import { asyncWrapper } from '../utils/asyncWrapper';
const router = Router();

router.post('/signup', asyncWrapper(signup));
router.get('/confirm/:token', asyncWrapper(confirmEmail));
router.post('/login', asyncWrapper(login));

export default router;
