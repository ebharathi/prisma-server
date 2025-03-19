// src/routes/auth.routes.ts
import { Router } from 'express';
import { signup, login, confirmEmail, generateNewRefreshToken, generateAccessTokenFromRefreshToken } from '../../controllers/auth/auth.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
const router = Router();

router.post('/signup', asyncWrapper(signup));
router.get('/confirm/:token', asyncWrapper(confirmEmail));
router.post('/login', asyncWrapper(login));
router.post("/accessToken",asyncWrapper(generateAccessTokenFromRefreshToken));
router.post("/refreshtoken",asyncWrapper(generateNewRefreshToken));

export default router;
