import jwt from 'jsonwebtoken';
import { ACCESS_SECRET ,REFRESH_SECRET } from '../config/env';


export function generateAccessToken(user: { id: string }) {
  return jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: '30m' });
}

export function generateRefreshToken(user: { id: string }) {
  return jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
