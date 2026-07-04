# Railway Deployment Guide for SokoNet

## Prerequisites
- Railway account (https://railway.app)
- GitHub account with SokoNet code pushed
- MongoDB Atlas connection string (you already have this!)

## Step 1: Prepare Your Code for Railway

### 1.1 Push Code to GitHub

If not already done:
```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sokonet.git
git push -u origin main
```

### 1.2 Verify Files

Ensure these files exist:
- ✅ `server/package.json` (has "start": "node server.js")
- ✅ `server/server.js` (listens on process.env.PORT)
- ✅ `server/.env` (don't commit this - use Railway env vars)
- ✅ `client/package.json` (has "build" and "preview" scripts)
- ✅ `client/vite.config.js`

## Step 2: Deploy Backend to Railway

### 2.1 Create Backend Service
1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your `sokonet` repository
5. Click **"Variables"** tab

### 2.2 Set Backend Environment Variables

Add these variables to your backend service:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://Lev:tkp7cZ3I02U3C8ds@cluster0.4fwnktm.mongodb.net/sokonet?retryWrites=true&w=majority
MOCK_MODE=false
JWT_SECRET=sokonet-production-secret-change-this
CLIENT_URL=https://your-frontend-url.railway.app
```

### 2.3 Configure Build Settings
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.4 Deploy
- Click **"Deploy"**
- Wait for deployment to complete (2-3 minutes)
- Railway will give you a URL like `https://sokonet-backend-xxx.railway.app`

## Step 3: Deploy Frontend to Railway

### 3.1 Create Frontend Service
1. In the same Railway project, click **"+ New Service"**
2. Select **"Deploy from GitHub repo"**
3. Select the same `sokonet` repository
4. Click **"Variables"** tab

### 3.2 Add Serve Package
First, install serve in your client:

```bash
cd client
npm install --save-dev serve
```

Update `client/package.json`:
```json
{
  "scripts": {
    "start": "serve -s dist -l 3000"
  }
}
```

### 3.3 Set Frontend Environment Variables

```
VITE_API_URL=https://your-backend-url.railway.app/api
```

### 3.4 Configure Build Settings
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 3.5 Deploy
- Click **"Deploy"**
- Wait for deployment (2-3 minutes)
- Railway will give you a URL like `https://sokonet-frontend-xxx.railway.app`

## Step 4: Connect Services

### 4.1 Update Backend CORS
In `server/server.js`, update the CORS origin:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
```

### 4.2 Update Frontend API URL
The Railway frontend will automatically use `VITE_API_URL` from environment variables.

## Step 5: Add MongoDB (Optional Alternative)

Instead of using Atlas, you can use Railway's MongoDB:

1. In Railway project, click **"+ New Service"**
2. Select **"Database"** → **"MongoDB"**
3. Railway will create and manage MongoDB
4. Click on the MongoDB service → **Variables** tab
5. Copy `MONGODB_URI`
6. Update your backend service variables with Railway's MongoDB URI

## Step 6: Test Deployment

### 6.1 Test Backend
Visit your backend URL:
```
https://your-backend-url.railway.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Netsoko Backend API is running successfully"
}
```

### 6.2 Test Frontend
Visit your frontend URL:
```
https://your-frontend-url.railway.app
```

Test:
- Login/Registration
- Dashboard
- All features

## Step 7: Set Up Custom Domain (Optional)

### 7.1 Buy Domain
Buy from Namecheap, GoDaddy, etc. (~$10/year)

### 7.2 Configure in Railway
1. Go to service → **Settings** → **Networking**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `app.sokonet.com`)
4. Update DNS records as shown

## Railway Pricing

- **Free Tier**: $5/month credit
  - ~512MB RAM
  - 1 vCPU
  - 1GB storage
  - Enough for small projects

- **Basic**: $5/month
  - 512MB RAM
  - 0.5 vCPU
  - 1GB storage

## Troubleshooting

### Build Fails
- Check `package.json` has correct scripts
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Check Railway build logs

### Backend Can't Connect to MongoDB
- Railway servers usually can connect to Atlas (better than local)
- Or use Railway's built-in MongoDB addon
- Check environment variables are set correctly

### Frontend Can't Connect to Backend
- Ensure `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Verify backend is running

## Monitoring

- Railway provides built-in metrics
- Check logs in dashboard
- Set up alerts for errors
- Monitor resource usage

## What's Deployed

✅ Backend (Node.js/Express)
✅ Frontend (React/Vite)
✅ MongoDB (Atlas or Railway's)
✅ Socket.io (real-time features)
✅ All API endpoints
✅ Authentication system

## Next Steps

After successful deployment:
1. Test all features thoroughly
2. Set up monitoring alerts
3. Configure custom domain
4. Set up SSL (automatic with Railway)
5. Scale up if needed
