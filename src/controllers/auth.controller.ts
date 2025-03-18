// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { sendConfirmationEmail } from '../services/mail.service';

export const signup = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { username, email, password, organization } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    const user = await prisma.user.create({
      data: { username, email, password: hashed, organization, confirmationToken },
    });

    await sendConfirmationEmail(email, confirmationToken);

    return res.status(201).json({ message: 'Confirmation email sent' });
  } catch (err) {
    return res.status(500).json({ error: 'Signup failed', detail: err });
  }
};

export const confirmEmail = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user || user.isConfirmed) {
      return res.status(400).json({ error: 'Invalid or already confirmed' });
    }

    await prisma.user.update({
      where: { email: decoded.email },
      data: { isConfirmed: true, confirmationToken: null },
    });

    const authToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ message: 'Email confirmed', token: authToken });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
};

export const login = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.isConfirmed)
      return res.status(401).json({ error: 'Email not confirmed. Please check your inbox.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', detail: err });
  }
};
