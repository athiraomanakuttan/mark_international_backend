// app.ts

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import authRouter from './router/authRouter';

// routers import
import adminStaffRouter from './router/admin/staffRouter';
import leadRouter from './router/admin/leadRouter';

const app = express();

// ✅ Logging incoming requests
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log("⚠️ Received request:", req.method, req.originalUrl);
  next();
});

// ✅ CORS configuration
const allowedOrigins = process.env.ORIGIN_URI?.split(',') || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

// ✅ Body parser and static files
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ API routes
app.use('/api/auth', authRouter);
app.use('/api/admin/staff', adminStaffRouter);
app.use('/api/admin/leads', leadRouter);

export default app;
