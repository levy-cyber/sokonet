# Quick Start: MongoDB Atlas Setup for SokoNet

## 🚀 5-Minute Setup

### 1. Create MongoDB Atlas Account (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Verify email

### 2. Create Free Cluster (2 minutes)
1. Click "Build a Database"
2. Select FREE plan
3. Choose AWS, region closest to you
4. Click "Create"
5. Wait 2-3 minutes

### 3. Create Database User (30 seconds)
1. Click "Create a Database User"
2. Username: `sokonet_admin` (or your choice)
3. Password: Create strong password (save it!)
4. Click "Create User"

### 4. Configure Network Access (30 seconds)
1. Click "Add My IP Address"
2. Select "Allow Access from Anywhere"
3. Click "Confirm"

### 5. Get Connection String (30 seconds)
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select Node.js, version 4.1+
4. Copy the connection string

### 6. Configure SokoNet (1 minute)

```bash
cd server
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb+srv://sokonet_admin:YOUR_PASSWORD@cluster0.mongodb.net/sokonet?retryWrites=true&w=majority
NODE_ENV=development
PORT=5000
MOCK_MODE=false
JWT_SECRET=generate-a-secure-random-string
```

### 7. Test Connection (30 seconds)

```bash
node test-mongodb.js
```

If successful:
```
✅ MongoDB Atlas Connected Successfully!
🎉 MongoDB Atlas setup is complete!
```

### 8. Start Server

```bash
npm start
```

## ✅ Done!

Your Netsoko is now running with MongoDB Atlas!

## 📖 Need Help?

- Full guide: See `MONGODB_ATLAS_SETUP.md`
- Common issues: See `MONGODB_ATLAS_SETUP.md` troubleshooting section
- MongoDB Atlas docs: https://docs.atlas.mongodb.com

## 🔧 Connection String Example

Replace `<password>` with your actual password:
```
mongodb+srv://sokonet_admin:MySecurePassword123@cluster0.xxxxx.mongodb.net/sokonet?retryWrites=true&w=majority
```

## 🎯 What's Next?

- Test your application features
- Seed initial data if needed
- Set up monitoring in Atlas
- Deploy to Railway/Render/Vercel
