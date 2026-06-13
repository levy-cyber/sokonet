# SokoNet Deployment Guide

This guide will help you deploy the SokoNet ecosystem to production.

## Prerequisites

- GitHub account
- MongoDB Atlas account (for database)
- Gmail account (for email service)
- Render account (for backend) or similar hosting
- Vercel account (for frontend) or similar hosting
- Expo account (for mobile app deployment)

## New Features Added

### 1. Email OTP & Password Reset
- Real Gmail integration using Nodemailer
- OTP sent to user's email for verification
- Password reset via email with secure tokens

### 2. Bank Account Integration
- Paybill: 247247
- Account: 0870185429080
- Bank transfer functionality in wallet system

### 3. Ride Request System
- Users can request rides with pickup/destination locations
- Riders can accept and manage ride requests
- Real-time status tracking
- Payment integration with wallet

### 4. Public Chatroom & User Search
- Public chatroom messages visible to all users
- User search by name or email
- Private messaging with conversation history
- Multiple chat rooms support

## Environment Variables

### Backend (.env)
```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sokonet?retryWrites=true&w=majority

# Server Configuration
NODE_ENV=production
PORT=5000

# Mock Mode (set to false for production with MongoDB)
MOCK_MODE=false

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=https://your-frontend-domain.com

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

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Gmail Setup for Email Service

1. Enable 2-Factor Authentication on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password
4. Use the App Password (not your regular password) in the `EMAIL_PASS` environment variable

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit with new features"
git branch -M main
git remote add origin https://github.com/your-username/sokonet.git
git push -u origin main
```

### 2. Deploy Backend to Render

1. Go to https://render.com/
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add all the variables from the Backend section above
5. Deploy

### 3. Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Create a new project
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL` with your backend URL
5. Deploy

### 4. Deploy Mobile App with Expo

1. Go to https://expo.dev/
2. Create a new project
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `mobile`
   - **Build Configuration**: Use `eas.json`
   - **Environment Variables**: Add `EXPO_PUBLIC_API_URL` with your backend URL
5. Build for iOS and Android

## Post-Deployment Checklist

- [ ] Verify backend health endpoint: `https://your-backend-domain.com/api/health`
- [ ] Test user registration and email OTP
- [ ] Test password reset functionality
- [ ] Test bank transfer in wallet
- [ ] Test ride request creation and acceptance
- [ ] Test public chatroom messages
- [ ] Test user search and private messaging
- [ ] Verify all API endpoints are accessible
- [ ] Check MongoDB connection
- [ ] Monitor error logs

## Troubleshooting

### Email Service Not Working
- Verify Gmail App Password is correct
- Check that 2FA is enabled on Gmail account
- Ensure `EMAIL_SERVICE=true` is set in environment variables

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Bank Transfer Issues
- Verify paybill and account numbers are correct
- Check wallet balance before transfers
- Ensure transaction records are being created

### Ride Request Issues
- Verify Rider profile exists for riders
- Check location coordinates are valid
- Ensure payment method is set correctly

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/send-otp` - Send OTP email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Wallet
- `GET /api/wallet` - Get wallet details
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `POST /api/wallet/bank-transfer` - Bank transfer

### Ride Requests
- `POST /api/ride-requests` - Create ride request
- `GET /api/ride-requests/my-rides` - Get my ride requests
- `GET /api/ride-requests/pending` - Get pending rides (for riders)
- `PUT /api/ride-requests/:id/accept` - Accept ride request
- `PUT /api/ride-requests/:id/status` - Update ride status
- `GET /api/ride-requests/:id` - Get ride request by ID

### Messages
- `GET /api/messages/:userId` - Get chat history
- `POST /api/messages` - Send message
- `GET /api/messages/public/:room` - Get public chatroom messages
- `GET /api/messages/search-users` - Search users
- `GET /api/messages/conversations` - Get all conversations

## Support

For deployment issues, check the Render, Vercel, and Expo documentation:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Expo: https://docs.expo.dev
