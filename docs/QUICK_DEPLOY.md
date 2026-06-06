# SokoNet Quick Deployment Guide

This guide will help you deploy the complete SokoNet platform to production in minutes.

## Prerequisites

- GitHub account (code already pushed to: https://github.com/levy-cyber/sokonet.git)
- Render account (free tier available)
- MongoDB Atlas account (free tier available)
- Vercel account (free tier available)

## Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Click "Build a Database"
4. Select "Free" tier (M0)
5. Choose a region (e.g., AWS - East US)
6. Create cluster
7. Create Database User:
   - Go to Database Access
   - Click "Add New Database User"
   - Username: `sokonet_admin`
   - Password: Generate a strong password (save this!)
   - Database User Privileges: Read and write to any database
8. Network Access:
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
9. Get Connection String:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://sokonet_admin:your_password@cluster.mongodb.net/sokonet?retryWrites=true&w=majority`

**Save this connection string for Step 2.**

## Step 2: Deploy Backend to Render (5 minutes)

1. Go to [Render](https://render.com)
2. Sign up and connect your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: `levy-cyber/sokonet`
5. Configure:
   - Name: `sokonet-api`
   - Branch: `main`
   - Runtime: `Node`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Click "Advanced"
7. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGO_URI` = (your MongoDB Atlas connection string from Step 1)
   - `JWT_SECRET` = `sokonet_super_secret_jwt_key_2026_prod_secure`
   - `JWT_EXPIRE` = `30d`
   - `MPESA_CONSUMER_KEY` = `dummy_mpesa_consumer_key`
   - `MPESA_CONSUMER_SECRET` = `dummy_mpesa_consumer_secret`
   - `MPESA_SHORTCODE` = `174379`
   - `MPESA_PASSKEY` = `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
   - `MPESA_ENV` = `sandbox`
   - `STRIPE_SECRET_KEY` = `sk_test_dummy_stripe_key_sokonet`
8. Click "Create Web Service"
9. Wait for deployment (2-3 minutes)
10. Copy the deployed URL (e.g., `https://sokonet-api.onrender.com`)

**Save this URL for Step 3.**

## Step 3: Deploy Frontend to Vercel (3 minutes)

1. Go to [Vercel](https://vercel.com)
2. Sign up and connect your GitHub account
3. Click "Add New Project"
4. Import your GitHub repository: `levy-cyber/sokonet`
5. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Environment Variables"
7. Add:
   - `VITE_API_URL` = (your Render backend URL from Step 2) + `/api`
   - Example: `https://sokonet-api.onrender.com/api`
8. Click "Deploy"
9. Wait for deployment (1-2 minutes)
10. Copy the deployed URL (e.g., `https://sokonet.vercel.app`)

## Step 4: Test the Deployment (2 minutes)

### Test Backend
```bash
curl https://sokonet-api.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "SokoNet API is running"
}
```

### Test Frontend
1. Open your Vercel URL in browser
2. Try to register a new user
3. Try to login
4. Navigate through the dashboard

## Step 5: Mobile App (Optional)

The mobile app is ready for Expo EAS build. To build an APK:

```bash
cd mobile
npm install
eas build --platform android --profile preview
```

## Your Deployed URLs

After deployment, you will have:

- **Backend API**: `https://sokonet-api.onrender.com/api`
- **Frontend Web**: `https://sokonet.vercel.app`
- **GitHub Repository**: `https://github.com/levy-cyber/sokonet.git`

## Share Your Platform

Share the frontend URL with others to showcase your SokoNet platform!

## Troubleshooting

### Backend Deployment Fails
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend Can't Connect to Backend
- Verify `VITE_API_URL` is correct
- Check backend is running
- Check CORS settings

### MongoDB Connection Issues
- Verify IP whitelist in MongoDB Atlas
- Check username and password
- Ensure cluster is created and running

## Next Steps

1. Set up real M-Pesa credentials for production payments
2. Set up real Stripe credentials for international payments
3. Configure custom domain names
4. Set up monitoring and error tracking
5. Add SSL certificates (Render provides this automatically)

## Support

For issues, check:
- Render logs
- Vercel deployment logs
- MongoDB Atlas logs
- GitHub repository: https://github.com/levy-cyber/sokonet/issues
