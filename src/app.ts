import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './router/authRouter';

const app = express();

const allowedOrigins = process.env.ORIGIN_URI?.split(",") || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);

export default app;