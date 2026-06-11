# SokoNet Deployment Guide

This guide covers deploying the complete SokoNet platform to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Mobile App Deployment (Expo EAS)](#mobile-app-deployment-expo-eas)
6. [Environment Variables](#environment-variables)

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Render account (for backend)
- Vercel account (for frontend)
- Expo account (for mobile)
- Git

## Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Select "Free" tier (M0)
   - Choose a region closest to your users (e.g., Nairobi)
   - Create cluster

3. **Create Database User**
   - Go to Database Access
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Grant read and write to any database

4. **Whitelist IP Addresses**
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click Confirm

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/sokonet?retryWrites=true&w=majority`

## Backend Deployment (Render)

1. **Prepare Backend Code**
   ```bash
   cd server
   npm install
   ```

2. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up and connect your GitHub account

3. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/sokonet.git
   git push -u origin main
   ```

4. **Create Web Service on Render**
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `sokonet/server` as root directory
   - Configure:
     - Name: `sokonet-api`
     - Runtime: `Node`
     - Build Command: `npm install`
     - Start Command: `node server.js`
   - Click "Advanced"
   - Add Environment Variables (see Environment Variables section)
   - Click "Create Web Service"

5. **Get Backend URL**
   - Render will provide a URL like `https://sokonet-api.onrender.com`
   - Save this URL for frontend configuration

## Frontend Deployment (Vercel)

1. **Prepare Frontend Code**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up and connect your GitHub account

3. **Deploy to Vercel**
   - Go to Vercel dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: `Vite`
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = your Render backend URL
   - Click "Deploy"

4. **Get Frontend URL**
   - Vercel will provide a URL like `https://sokonet.vercel.app`

## Mobile App Deployment (Expo EAS)

1. **Install Expo CLI**
   ```bash
   npm install -g expo-cli eas-cli
   ```

2. **Configure EAS**
   ```bash
   cd mobile
   eas build:configure
   ```

3. **Login to Expo**
   ```bash
   expo login
   ```

4. **Build Android APK**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Build iOS (requires Apple Developer account)**
   ```bash
   eas build --platform ios --profile production
   ```

6. **Submit to App Stores**
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sokonet?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey
MPESA_ENV=sandbox

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### Frontend (.env)
```env
VITE_API_URL=https://sokonet-api.onrender.com/api
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=https://sokonet-api.onrender.com/api
```

## M-Pesa Integration Setup

1. **Get M-Pesa Daraja API Credentials**
   - Go to [Safaricom Developer Portal](https://developer.safaricom.co.ke)
   - Create an account
   - Create a new app
   - Get Consumer Key and Secret
   - Get Shortcode and Passkey

2. **Update Environment Variables**
   - Add M-Pesa credentials to backend `.env`
   - Set `MPESA_ENV=production` for live transactions

## Stripe Integration Setup

1. **Get Stripe API Keys**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Get API keys from Developers section
   - Test mode keys for development
   - Live mode keys for production

2. **Update Environment Variables**
   - Add Stripe secret key to backend `.env`

## Post-Deployment Checklist

- [ ] Test backend health endpoint
- [ ] Test user registration and login
- [ ] Test marketplace functionality
- [ ] Test wallet deposits and withdrawals
- [ ] Test escrow transactions
- [ ] Test real-time messaging
- [ ] Test mobile app on device
- [ ] Set up monitoring and logging
- [ ] Configure SSL certificates
- [ ] Set up backup strategy
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry)

## Monitoring and Maintenance

### Backend Monitoring
- Use Render's built-in metrics
- Set up uptime monitoring
- Configure log aggregation

### Frontend Monitoring
- Use Vercel Analytics
- Set up error tracking
- Monitor performance metrics

### Mobile App Monitoring
- Use Expo Analytics
- Set up crash reporting
- Monitor app performance

## Scaling Considerations

- **Backend**: Upgrade Render plan as traffic grows
- **Database**: Upgrade MongoDB Atlas cluster
- **Frontend**: Vercel automatically scales
- **Mobile**: Use CDN for app distribution

## Security Best Practices

1. Always use HTTPS in production
2. Rotate API keys regularly
3. Use environment variables for secrets
4. Implement rate limiting
5. Keep dependencies updated
6. Use input validation
7. Implement CORS properly
8. Enable security headers

## Troubleshooting

### Backend Issues
- Check Render logs
- Verify MongoDB connection
- Check environment variables
- Review server logs

### Frontend Issues
- Check Vercel deployment logs
- Verify API URL configuration
- Check browser console for errors
- Test API endpoints directly

### Mobile App Issues
- Check Expo build logs
- Verify API URL in mobile .env
- Test on physical device
- Check network connectivity

## Support

For issues or questions:
- Check documentation in `/docs`
- Review GitHub issues
- Contact support team
