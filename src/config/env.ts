import dotenv from 'dotenv';
dotenv.config();


export const PORT = process.env.PORT || 9000;
export const ACCESS_SECRET = process.env.ACCESS_SECRET || 'defaultjwt';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshtokensecret'; 
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const SMTP_EMAIL_USER = process.env.SMTP_EMAIL_USER || '';
export const SMTP_EMAIL = process.env.SMTP_EMAIL || '';
export const SMTP_EMAIL_PASSWORD = process.env.SMTP_EMAIL_PASSWORD || '';


//CONFIGURATIONS 
export const ENABLE_EMAIL_CONFIRMATION = process.env.ENABLE_EMAIL_CONFIRMATION === 'true';
export const ENABLE_OAUTH_SIGNIN = process.env.ENABLE_OAUTH_SIGNIN === 'true';
export const OAUTH_CLIENT_REDIRECT_URL = process.env.OAUTH_CLIENT_REDIRECT_URL || '';
export const ENABLE_GOOGLE_SIGNIN = process.env.ENABLE_GOOGLE_SIGNIN === 'true';
export const ENABLE_LINKEDIN_SIGNIN = process.env.ENABLE_LINKEDIN_SIGNIN === 'true';
export const ENABLE_GITHUB_SIGNIN = process.env.ENABLE_GITHUB_SIGNIN === 'true';
