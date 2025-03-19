// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_SECRET,REFRESH_SECRET ,ENABLE_EMAIL_CONFIRMATION } from '../../config/env';
import { sendConfirmationEmail } from '../../services/mail.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/tokenGenerator';

export const signup = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { username, email, password, organization } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    const hashed = await bcrypt.hash(password, 10);
    const confirmationToken = jwt.sign({ email },ACCESS_SECRET+REFRESH_SECRET, { expiresIn: '1d' });

    const user = await prisma.user.create({
      data: { username, email, password: hashed, organization, confirmationToken },
    });

    if(ENABLE_EMAIL_CONFIRMATION)
      await sendConfirmationEmail(email, confirmationToken);
    else 
    {
      req.params.token=confirmationToken;
      return confirmEmail(req,res);
    }
    return res.status(201).json({ message: 'Confirmation email sent' });
  } catch (err) {
    return res.status(500).json({ error: 'Signup failed', detail: err });
  }
};

export const confirmEmail = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { token } = req.params;
    
    const decoded = jwt.verify(token,ACCESS_SECRET+REFRESH_SECRET) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user || user.isConfirmed) {
      return res.status(400).json({ error: 'Invalid or already confirmed' });
    }

    const authToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { isConfirmed: true, confirmationToken: null,refreshToken },
    });


    return res.status(200).json({ message: 'Signup Success & Email confirmed.', authToken,refreshToken });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token' ,data:err});
  }
};

export const login = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.isConfirmed)
      return res.status(401).json({ error: 'Email not confirmed. Please check your inbox.' });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const authToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    await prisma.user.update({
      where:{id:user.id},
      data:{refreshToken}
    })

    return res.json({ authToken,refreshToken, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', detail: err });
  }
};

export const generateAccessTokenFromRefreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });

    const decoded = verifyRefreshToken(refreshToken) as { userId: string };

    if (!decoded?.userId) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Unauthorized or token mismatch' });
    }

    const newAccessToken = generateAccessToken(user); 

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
};

export const generateNewRefreshToken=async(req:Request,res:Response):Promise<Response> =>{
  try {
    const {refreshToken} = req.body;
    if(!refreshToken) return res.status(400).json({error:'Missing refresh token'});
    
    const decoded=verifyRefreshToken(refreshToken) as {userId:string};
    if(!decoded.userId) return res.status(401).json({ error: 'Invalid refresh token' });
     
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Unauthorized or token mismatch' });
    }

    const newRefreshToken = generateRefreshToken(user);
    await prisma.user.update({
      where:{id:user.id},
      data:{refreshToken:newRefreshToken}
    })
    return res.status(200).json({refreshToken:newRefreshToken})

  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}