import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import escrowRoutes from './routes/escrowRoutes.js';
import riderRoutes from './routes/riderRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { initSocketServer } from './socket/socketServer.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SokoNet backend is healthy' });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to SokoNet backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/shops', shopRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
await initSocketServer(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`SokoNet backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
