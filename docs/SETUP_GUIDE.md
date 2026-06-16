# SokoNet Setup Guide

This guide provides step-by-step instructions for setting up the SokoNet platform for development and production.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Git

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select a region closest to Kenya (e.g., AWS Cape Town)
   - Click "Create"

3. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Add your IP address or allow access from anywhere (0.0.0.0/0)

4. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Create username and password
   - Select "Read and write to any database"

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Select Node.js version
   - Copy the connection string
   - Replace `<password>` with your database password

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Install MongoDB Community Server
   - Start MongoDB service

2. **Verify Installation**
   ```bash
   mongod --version
   mongo --version
   ```

## Backend Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SokoNet
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sokonet?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=development
PORT=5000

# Mock Mode (set to false for production with MongoDB)
MOCK_MODE=false

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# M-Pesa Configuration (for payments)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_mpesa_shortcode

# Bank Account Configuration
BANK_PAYBILL=247247
BANK_ACCOUNT=0870185429080

# Email Configuration (Gmail)
EMAIL_SERVICE=true
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@sokonet.com
```

### 4. Seed Admin Accounts
```bash
node scripts/seedAdminAccounts.js
```

This creates:
- Super Admin: admin@netsoko.co.ke / bignetsoko@9625white
- Support: support@sokonet.co.ke / levnetsoko@9625blue

### 5. Start Backend Server
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Mobile App Setup (Optional)

### 1. Install Mobile Dependencies
```bash
cd mobile
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start Expo Development Server
```bash
npm run start
```

## Verification

### 1. Test Backend Connection
```bash
curl http://localhost:5000/api
```

Expected response:
```json
{
  "message": "SokoNet API is running"
}
```

### 2. Test Database Connection
Check the backend console for:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

If you see:
```
🧪 Running in MOCK MODE (No MongoDB)
```
Then your MongoDB connection is not configured correctly.

### 3. Test Admin Login
- Navigate to `http://localhost:3000/admin-login`
- Login with Super Admin credentials
- Verify you can access the admin dashboard

### 4. Test Support System
- Navigate to `http://localhost:3000/support`
- Create a support ticket
- Verify ticket creation and messaging

## Troubleshooting

### MongoDB Connection Issues

**Error**: `querySrv ECONNREFUSED _mongodb._tcp.cluster0.mongodb.net`

**Solution**:
1. Check your MongoDB Atlas cluster is running
2. Verify your IP address is whitelisted in Network Access
3. Ensure your connection string is correct
4. Check your firewall settings

**Error**: `Authentication failed`

**Solution**:
1. Verify your database username and password
2. Check the database user has proper permissions
3. Ensure you're using the correct authentication method

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change the PORT in .env
PORT=5001
```

### CORS Issues

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Verify `CLIENT_URL` in backend `.env` matches frontend URL
2. Check CORS configuration in `server/index.js`

### Environment Variables Not Loading

**Error**: `undefined` or missing configuration

**Solution**:
1. Ensure `.env` file exists in the correct directory
2. Restart the server after changing `.env`
3. Check for typos in variable names
4. Verify no extra spaces in values

## Development Workflow

### 1. Start Development Environment
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 2. Run Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### 3. Code Quality
```bash
# Lint backend
cd server
npm run lint

# Lint frontend
cd client
npm run lint
```

## Production Deployment

### Backend Deployment (Render)

1. **Prepare for Deployment**
   ```bash
   cd server
   npm run build
   ```

2. **Deploy to Render**
   - Connect your GitHub repository to Render
   - Select the `server` directory as root
   - Configure environment variables in Render dashboard
   - Deploy

### Frontend Deployment (Vercel)

1. **Prepare for Deployment**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Select the `client` directory as root
   - Configure environment variables in Vercel dashboard
   - Deploy

### Mobile Deployment (Expo EAS)

1. **Configure EAS**
   ```bash
   cd mobile
   npm install -g eas-cli
   eas build:configure
   ```

2. **Build for Production**
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

## Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT secrets** - Generate random strings
3. **Enable HTTPS in production** - Use SSL certificates
4. **Implement rate limiting** - Prevent API abuse
5. **Validate all inputs** - Sanitize user data
6. **Use environment-specific configs** - Separate dev/prod settings
7. **Regular security updates** - Keep dependencies updated
8. **Monitor logs** - Track suspicious activities

## Support

For setup issues:
1. Check the troubleshooting section above
2. Review error messages in console
3. Verify environment variables are set correctly
4. Ensure MongoDB is accessible
5. Check network connectivity

For additional support, contact the development team.
