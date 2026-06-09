require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const initSocketServer = require('./socket/socketServer');

// Create Express instance
const app = express();
const server = http.createServer(app);

// Connect Database (will use mock mode if no MongoDB)
connectDB();

// Init Socket Server
initSocketServer(server);

// Middleware
app.use(cors());
app.use(express.json());

// Base check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SokoNet Backend API is running successfully' });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/escrow', require('./routes/escrowRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/riders', require('./routes/riderRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/shops', require('./routes/shopRoutes'));

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});