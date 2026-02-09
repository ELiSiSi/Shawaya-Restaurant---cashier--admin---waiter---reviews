import compression from 'compression';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import xss from 'xss-clean';
dotenv.config();

import adminRouter from './routes/adminRouter.js';
import mealRouter from './routes/mealRouter.js';
import offerRouter from './routes/offerRouter.js';
import orderRouter from './routes/orderRouter.js';
import viewRouter from './routes/viewRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import AppError from './utils/appError.js';

const MONGO_URI = process.env.MONGO_URI;
const app = express();
const port = process.env.PORT || 3000;

// ✅ Global caching للـ mongoose في serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB Error:', e);
    throw e;
  }

  return cached.conn;
}

// حل مشكلة __dirname في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//-----------------------------------------------------------------------------------------
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// ✅ Middleware للـ nonce و stripePublicKey
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  res.locals.stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY;
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 2) تنظيف البيانات من NoSQL Injection
app.use(mongoSanitize());

// 3) تنظيف البيانات من XSS Attack
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 4) يمنع تكرار نفس Query Parameter أكتر من مرة
app.use(hpp());

//-----------------------------------------------------------------------------------------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// تحميل أسرع للصفحات استهلاك إنترنت أقل
app.use(compression());

//--------------------------------------------------------------------------------------------
// ✅ Middleware للاتصال بقاعدة البيانات قبل كل request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(new AppError('Database connection failed', 500));
  }
});

//--------------------------------------------------------------------------------------------
// =================================== The Routes ============================================
//--------------------------------------------------------------------------------------------

app.get('/.well-known/*', (req, res) => res.status(204).end());

app.use('/api/v1/meal', mealRouter);
app.use('/api/v1/offer', offerRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/', viewRouter);
app.use('/admin', adminRouter);

// 404 handler للـ routes اللي مش موجودة
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler (في الآخر!)
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // عرض صفحة error
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
});

//----------------------------------------------------------------------------------------------------------
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection 💥');
  console.log(err.name, err.message);
});

process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception 💥');
  console.log(err.name, err.message);
});

//-----------------------------------------------------------------------------------------
// ✅ للـ local development فقط
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`🚀 App listening at http://localhost:${port}`);
    });
  });
}

// ✅ للـ Vercel serverless
export default app;
