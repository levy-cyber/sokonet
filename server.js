require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const initSocketServer = require('./socket/socketServer');

// Create Express instance
const app = express();
const server = http.createServer(app);

// Quick environment validation for M-Pesa integration
(() => {
  const required = ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORTCODE', 'MPESA_PASSKEY', 'BACKEND_URL'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn('Warning: Missing environment variables for M-Pesa integration:', missing.join(', '));
    console.warn('Set these in server/.env or your environment before enabling production M-Pesa flows.');
  }
})();

// Trust first proxy when behind proxies/load balancers (for secure cookies, IP rate-limiting)
app.set('trust proxy', 1);

// Connect Database (will use mock mode if no MongoDB)
connectDB();

// Init Socket Server
initSocketServer(server);

// Security middleware
// Configure CORS to allow origins from environment or fallback to localhost client
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];
console.log(process.env.MPESA_CONSUMER_KEY);
console.log(process.env.MPESA_SHORTCODE);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(helmet());
// Preserve raw body for webhook signature verification while still parsing JSON
app.use(
  express.json({
    limit: '10kb',
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Base check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Netsoko Backend API is running successfully' });
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
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/shops', require('./routes/shopRoutes'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ride-requests', require('./routes/rideRequestRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(

"/api/mpesa",

require("./routes/mpesa.routes")

);

app.post(

"/api/mpesa/callback",

(req,res)=>{

console.log(req.body);


// update transaction status

res.sendStatus(200);

}

);
// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});
const { getAccessToken } = require("./services/mpesaService");

(async () => {
    const mpesaService = require("./services/mpesaService");
    const token = await mpesaService.getAccessToken();
    console.log("ACCESS TOKEN:");
    console.log(token);
})();