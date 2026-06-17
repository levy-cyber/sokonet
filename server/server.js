require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB, createIndexes, monitorConnection } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const initSocketServer = require('./socket/socketServer');

// Log startup information
console.log('='.repeat(50));
console.log('🚀 Starting Netsoko Backend API...');
console.log('='.repeat(50));
console.log(`📅 Startup Time: ${new Date().toISOString()}`);
console.log(`🌍 Node Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${process.env.PORT || '5000 (default)'}`);
console.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'NOT CONFIGURED - will use mock mode'}`);
console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'NOT CONFIGURED'}`);
console.log('='.repeat(50));

// Create Express instance
const app = express();
const server = http.createServer(app);

// Middleware (must be before routes)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoints (must be before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Netsoko Backend API is running successfully', version: '2.0.0' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Netsoko Backend API is running successfully', version: '2.0.0' });
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
console.log('🔌 Starting database connection (non-blocking)...');
connectDB().then(() => {
  console.log('✅ Database connection established');
  // Create indexes after successful connection
  createIndexes().then(() => {
    console.log('✅ Database indexes created');
  }).catch(err => {
    console.error('⚠️  Failed to create indexes:', err.message);
  });
  // Start connection monitoring
  monitorConnection();
}).catch(err => {
  console.error('❌ Database connection failed, running in mock mode:', err.message);
  // Don't block server startup on DB failure
});

// Init Socket Server (non-blocking)
console.log('🔌 Initializing socket server (non-blocking)...');
try {
  initSocketServer(server);
  console.log('✅ Socket server initialized');
} catch (err) {
  console.error('❌ Failed to initialize socket server:', err.message);
  // Don't block server startup on socket failure
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('✅ Server started successfully');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`� Health: http://localhost:${PORT}/health`);
  console.log(`�🔐 Admin: admin@netsoko.co.ke`);
  console.log(`🎧 Support: support@sokonet.co.ke`);
  console.log('='.repeat(50));
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

// Handle process errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});