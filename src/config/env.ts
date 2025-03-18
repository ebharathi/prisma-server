import dotenv from 'dotenv';
dotenv.config();


export const PORT = process.env.PORT || 9000;
export const JWT_SECRET = process.env.JWT_SECRET || 'defaultjwt'; 
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const SMTP_EMAIL_USER = process.env.SMTP_EMAIL_USER || '';
export const SMTP_EMAIL = process.env.SMTP_EMAIL || '';
export const SMTP_EMAIL_PASSWORD = process.env.SMTP_EMAIL_PASSWORD || '';
