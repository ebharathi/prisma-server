// src/services/mail.service.ts
import nodemailer from 'nodemailer';
import { FRONTEND_URL,SMTP_EMAIL_USER,SMTP_EMAIL,SMTP_EMAIL_PASSWORD } from '../config/env';


export const sendConfirmationEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_EMAIL_PASSWORD,
    },
  });

  const confirmUrl = `${FRONTEND_URL}/email-confirmation?tkn=${token}`;

  await transporter.sendMail({
    from: SMTP_EMAIL_USER,
    to,
    subject: 'Confirm your email',
    html: `<h2>Welcome!</h2><p>Please confirm your email by clicking <a href="${confirmUrl}">here</a>.</p>`,
  });
};
