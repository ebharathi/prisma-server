import express from 'express';
import cors from "cors";
import passport from "passport";
import "./controllers/auth/passport";

import { PORT,ENABLE_OAUTH_SIGNIN } from './config/env';

import authRoutes from "./routes/auth/auth.routes";
import OAuthRoutes from "./routes/auth/oauth.routes";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));


app.get('/', async (req, res) => {
  res.send('🔥Working fine as a wine');
});

//Routes
app.use('/api/v1/auth',authRoutes);
if(ENABLE_OAUTH_SIGNIN){
  console.log("[+]OAuth Signin Enabled.")
  app.use(passport.initialize());
  app.use('/api/v1/oauth',OAuthRoutes);
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
