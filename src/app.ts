// app.ts

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import authRouter from './router/authRouter';

// routers import
import adminStaffRouter from './router/admin/staffRouter';
import leadRouter from './router/admin/leadRouter';
import transferRouter from './router/admin/transferLeadRouter'
import adminDashboardRouter from './router/admin/dashboardRouter'
import profileRouter from './router/admin/profileRouter'
import branchRouter from './router/admin/branchRouter'
import designationRouter from './router/admin/designationRouter'
import { employeeRouter } from './router/admin/employeeRouter'

// staff
import staffDashboardRouter from './router/staff/dashboardRouter'
import staffLeadRouter from './router/staff/leadRouter'

import leadHistoryRouter from './router/leadHistoryRouter'
import followupRouter from './router/followupRouter';
import eventRouter from './router/eventRouter';
import registrationRouter from './router/registrationRouter';
import leaveRouter from './router/leaveRouter';
import { uploadRouter } from './router/uploadRouter';
import adminResignationRouter from './router/admin/resignationRouter';
import staffResignationRouter from './router/staff/resignationRouter';
import adminTerminationRouter from './router/admin/terminationRouter';

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

// ✅ Body parser
app.use(express.json());
// Note: No longer serving static files from uploads folder - using Cloudinary instead

// ✅ API routes
app.use('/api/auth', authRouter);
app.use('/api/admin/staff', adminStaffRouter);
app.use('/api/admin/leads', leadRouter);
app.use('/api/admin/transfer', transferRouter);
app.use('/api/admin/dashboard', adminDashboardRouter);
app.use('/api/admin/profile',profileRouter)
app.use('/api/admin/branches', branchRouter)
app.use('/api/admin/designations', designationRouter)
app.use('/api/admin/employees', employeeRouter)

app.use('/api/staff/dashboard', staffDashboardRouter)
app.use('/api/staff/leads', staffLeadRouter);
app.use('/api/lead-history', leadHistoryRouter)
app.use('/api/followup', followupRouter)

app.use('/api/events',eventRouter)
app.use('/api/students', eventRouter)
app.use('/api', registrationRouter)
app.use('/api', leaveRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/admin/resignations', adminResignationRouter)
app.use('/api/staff/resignation', staffResignationRouter)
app.use('/api/admin/terminations', adminTerminationRouter)

export default app;
