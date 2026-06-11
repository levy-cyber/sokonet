# MongoDB Atlas Setup Guide for SokoNet

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Choose one of:
   - **Sign up with Google** (easiest)
   - Sign up with email
4. Verify your email address
5. Complete your profile

## Step 2: Create a Free Cluster

1. After logging in, click **"Build a Database"**
2. Select **"FREE"** plan (M0 Sandbox - 512MB storage)
3. **Cloud Provider**: AWS (recommended)
4. **Region**: Choose closest to your target users
   - For Kenya/East Africa: AWS (eu-central-1) Frankfurt
   - For Global: AWS (us-east-1) N. Virginia
5. **Cluster Name**: Enter `SokoNet` or leave default
6. Click **"Create Cluster"**
7. Wait for cluster creation (2-5 minutes)

## Step 3: Create Database User

1. Click **"Create a Database User"**
2. **Authentication Method**: Choose **"Password"**
3. **Username**: Enter a username (e.g., `sokonet_admin`)
   - ⚠️ **Save this username!**
4. **Password**: Create a strong password (12+ characters)
   - ⚠️ **Save this password!**
5. Click **"Create User"**

## Step 4: Configure Network Access

### Option A: Allow Access from Anywhere (Easier, Less Secure)
1. Click **"Add My IP Address"**
2. Change "Access from Anywhere" to **"Allow Access from Anywhere"**
3. Click **"Confirm"**

### Option B: Allow Specific IP (More Secure)
1. Click **"Add My IP Address"** to add your current IP
2. For deployment platforms (Railway, Vercel, etc.), you'll need to add their IPs
3. Click **"Add IP Address"** and enter specific IPs

## Step 5: Get Connection String

1. Wait for cluster to finish creating (green checkmark)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string:
   ```
   mongodb+srv://sokonet_admin:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure SokoNet

### 6.1 Create .env file
Copy `.env.example` to `.env`:
```bash
cd server
cp .env.example .env
```

### 6.2 Update .env with your Atlas credentials
Replace `<username>` and `<password>` with your actual credentials:
```env
MONGODB_URI=mongodb+srv://sokonet_admin:YourSecurePassword123@cluster0.mongodb.net/sokonet?retryWrites=true&w=majority
NODE_ENV=development
PORT=5000
MOCK_MODE=false
JWT_SECRET=generate-secure-random-string-here
CLIENT_URL=http://localhost:3000
```

### 6.3 Generate JWT Secret
Generate a secure random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator like:
# https://generate-random.org/api-key-generator
```

Use the output as your `JWT_SECRET`.

## Step 7: Test Connection

### 7.1 Install dependencies (if not already done)
```bash
cd server
npm install
```

### 7.2 Run the test script
```bash
node test-mongodb.js
```

If successful, you should see:
```
✅ MongoDB connected successfully!
📚 Collections: []
✅ Disconnected successfully
```

## Step 8: Start Your Server

```bash
cd server
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5000
```

## Step 9: Verify Data in Atlas

1. Go to your MongoDB Atlas dashboard
2. Click **"Collections"** under your cluster
3. You should see your database `sokonet` with collections created by your app
4. Click **"Browse Collections"** to view data

## Atlas Dashboard Features

### Monitoring
- **Metrics**: CPU, RAM, storage usage
- **Performance Advisor**: Optimization suggestions
- **Slow Query Analyzer**: Find slow queries

### Security
- **Network Access**: Manage IP whitelist
- **Database Access**: Manage users and roles
- **Data Explorer**: View and edit data
- **Backup**: Automatic backups

### Scaling
- **Free Tier**: 512MB storage
- **Upgrade**: Scale up as needed
- **Serverless**: Auto-scaling (pay-per-use)

## Deployment Configuration

### For Railway
Add these environment variables to your Railway backend service:
```
MONGODB_URI=mongodb+srv://sokonet_admin:YourPassword@cluster0.mongodb.net/sokonet?retryWrites=true&w=majority
NODE_ENV=production
MOCK_MODE=false
JWT_SECRET=your-production-jwt-secret
```

### For Render
Same as above, add to Render environment variables.

### For Vercel (Backend only)
Add to Vercel environment variables.

## Common Issues & Solutions

### Issue: "Authentication Failed"
**Solution**: Double-check username and password in connection string. Password might need URL encoding if it has special characters.

### Issue: "Connection Timeout"
**Solution**: 
- Check your network/firewall settings
- Ensure IP whitelist includes your IP
- Try different region in Atlas

### Issue: "ENOTFOUND cluster0.mongodb.net"
**Solution**: 
- Check DNS settings
- Ensure you're using `mongodb+srv://` (not `mongodb://`)
- Verify cluster is running (green checkmark)

### Issue: "IP Not Whitelisted"
**Solution**: 
- Add your IP to Network Access in Atlas
- Or use "Allow Access from Anywhere" (less secure)

## Best Practices

### Security
1. ✅ Use strong passwords (12+ characters)
2. ✅ Never commit `.env` to Git
3. ✅ Use different databases for dev/staging/production
4. ✅ Enable IP whitelisting
5. ✅ Rotate passwords regularly

### Performance
1. ✅ Use indexes on frequently queried fields
2. ✅ Monitor slow queries
3. ✅ Use connection pooling
4. ✅ Optimize query patterns

### Cost Management
1. ✅ Start with free tier
2. ✅ Monitor storage usage
3. ✅ Delete unused data
4. ✅ Set up alerts for usage limits

## Next Steps

After setting up MongoDB Atlas:

1. ✅ Test your application locally with Atlas
2. ✅ Seed initial data if needed
3. ✅ Set up backups
4. ✅ Configure monitoring alerts
5. ✅ Deploy to your hosting platform

## Atlas Free Tier Limits

- **512MB storage** per cluster
- **Shared RAM** (~256MB)
- **0.5 vCPU** shared
- **No. of connections**: 500 connections
- **Backup**: Basic backups included
- **No SLA** on free tier

## When to Upgrade

Consider upgrading when:
- Storage exceeds 512MB
- Need dedicated RAM/CPU
- Require higher connection limits
- Need SLA guarantees
- Need advanced security features

## Support

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Community Forum: https://community.mongodb.com
- Support: Available in paid tiers
