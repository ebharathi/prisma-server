import express from 'express';
import { PORT } from './config/env';

import authRoutes from "./routes/auth.routes";

const app = express();
app.use(express.json());


app.get('/', async (req, res) => {
  res.send('🔥Working fine as a wine');
});

//Routes
app.use('/api/v1/auth',authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
