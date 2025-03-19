// src/routes/sso.routes.ts
import { Router } from 'express';
import passport from 'passport';
import { FRONTEND_URL,OAUTH_CLIENT_REDIRECT_URL,ENABLE_GOOGLE_SIGNIN,ENABLE_GITHUB_SIGNIN,ENABLE_LINKEDIN_SIGNIN  } from '../../config/env';
const router = Router();

// Google
if(ENABLE_GOOGLE_SIGNIN){
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const { authToken,refreshToken } = req.user as { authToken: string,refreshToken:string };
    res.redirect(`${FRONTEND_URL}${OAUTH_CLIENT_REDIRECT_URL}?authToken=${authToken}&refreshToken=${refreshToken}`);
  });
}

// GitHub
if(ENABLE_GITHUB_SIGNIN){
  router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
  router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
    const { authToken,refreshToken } = req.user as { authToken: string,refreshToken:string };
    res.redirect(`${FRONTEND_URL}${OAUTH_CLIENT_REDIRECT_URL}?authToken=${authToken}&refreshToken=${refreshToken}`);
  });
}

// LinkedIn
if(ENABLE_LINKEDIN_SIGNIN){
  router.get('/linkedin', passport.authenticate('linkedin'));
  router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false }), (req, res) => {
    const { authToken,refreshToken } = req.user as { authToken: string,refreshToken:string };
    res.redirect(`${FRONTEND_URL}${OAUTH_CLIENT_REDIRECT_URL}?authToken=${authToken}&refreshToken=${refreshToken}`);
  });
}

export default router;
