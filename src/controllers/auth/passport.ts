// src/auth/passport.ts
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import LinkedInStrategy from 'passport-linkedin-oauth2';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import prisma from '../../prisma/client';
import { ENABLE_GOOGLE_SIGNIN,ENABLE_GITHUB_SIGNIN,ENABLE_LINKEDIN_SIGNIN } from '../../config/env';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenGenerator';


//GOOGLE OAUTH
if(ENABLE_GOOGLE_SIGNIN)
  passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback',
  }, async (_, __, profile, done) => {
    const email = profile.emails?.[0].value;
    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

    if (!user && email) {
      user = await prisma.user.findFirst({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: profile.id },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            username: profile.displayName,
            googleId: profile.id,
            avatar:profile.photos?.[0].value,
            isConfirmed: true,
          },
        });
      }
    }
    const authToken=generateAccessToken(user!);
    const refreshToken=generateRefreshToken(user!);
    await prisma.user.update({
      where:{id:user!.id},
      data:{refreshToken}
    })
    done(null, { authToken,refreshToken });
  }));

//LINKEDIN OAUTH
if(ENABLE_LINKEDIN_SIGNIN)
  passport.use(new LinkedInStrategy.Strategy({
    clientID: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, async (_accessToken, _refreshToken, profile, done) => {
    const email = profile.emails?.[0].value;
    let user = await prisma.user.findUnique({ where: { linkedinId: profile.id } });

    if (!user && email) {
      user = await prisma.user.findFirst({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { linkedinId: profile.id },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            username: profile.displayName,
            linkedinId: profile.id,
            avatar:profile.photos?.[0].value,
            isConfirmed: true,
          },
        });
      }
    }

    const authToken=generateAccessToken(user!);
    const refreshToken=generateRefreshToken(user!);
    await prisma.user.update({
      where:{id:user!.id},
      data:{refreshToken}
    })
    done(null, { authToken,refreshToken });
  }));

//GIT OAUTH
if(ENABLE_GITHUB_SIGNIN)
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: '/auth/github/callback',
    scope: ['user:email'],
  }, async (
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: any) => void
  ) => {
    let user = await prisma.user.findUnique({ where: { githubId: profile.id } });
    const email = profile.emails?.[0]?.value || `${profile.username}@github.com`; 

    if (!user) {
      user = await prisma.user.findFirst({ where: { email } });
      if(user)
          user = await prisma.user.update({
            where: { id: user.id },
            data: { githubId: profile.id },
          });
      else
        user = await prisma.user.create({
          data: {
            email,
            username: profile.username || 'GitHub User',
            githubId: profile.id,
            avatar:profile.photos?.[0].value,
            isConfirmed: true,
          },
        });
    }

    const authToken=generateAccessToken(user!);
    refreshToken=generateRefreshToken(user!);
    await prisma.user.update({
      where:{id:user!.id},
      data:{refreshToken}
    })
    done(null, { authToken,refreshToken });
  }));
