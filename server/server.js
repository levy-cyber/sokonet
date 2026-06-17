require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB, createIndexes, monitorConnection } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const initSocketServer = require('./socket/socketServer');

// Create Express instance
const app = express();
const server = http.createServer(app);

// Middleware (must be before routes)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base check route (must be before other routes)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Netsoko Backend API is running successfully', version: '2.0.0' });
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
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ride-requests', require('./routes/rideRequestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error Handler Middleware
app.use(errorHandler);

// Connect Database (non-blocking) - start after server is ready
connectDB().then(() => {
  // Create indexes after successful connection
  createIndexes();
  // Start connection monitoring
  monitorConnection();
}).catch(err => {
  console.error('Failed to initialize database:', err);
  // Don't block server startup on DB failure
});

// Init Socket Server (non-blocking)
try {
  initSocketServer(server);
} catch (err) {
  console.error('Failed to initialize socket server:', err);
  // Don't block server startup on socket failure
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`🔐 Admin: admin@netsoko.co.ke`);
  console.log(`🎧 Support: support@sokonet.co.ke`);
});