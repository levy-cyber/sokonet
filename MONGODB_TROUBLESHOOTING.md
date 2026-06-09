# MongoDB Atlas Connection Troubleshooting

## Current Error
```
❌ MongoDB Connection Error:
   Message: querySrv ECONNREFUSED _mongodb._tcp.cluster0.4fwnktm.mongodb.net
```

## Step-by-Step Troubleshooting

### Step 1: Check Cluster Status in Atlas

1. Go to https://cloud.mongodb.com
2. Log in with your credentials
3. Navigate to your cluster `cluster0`

**What to look for:**
- ✅ **Green checkmark** = Cluster is running and ready
- ⏳ **Yellow circle** = Cluster is creating/updating (wait 5-10 minutes)
- ⏸️ **Paused** = Cluster is paused (click Resume)
- ❌ **Red X** = Cluster has errors

**If cluster is paused:**
1. Click the cluster name
2. Click "Resume" button
3. Wait 2-3 minutes for it to start

### Step 2: Verify Network Access (IP Whitelist)

1. In Atlas dashboard, click **Network Access** in left sidebar
2. Check if your IP is listed

**If not listed or you want to allow all:**
1. Click **"Add IP Address"**
2. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
3. Click **"Confirm"**
4. Wait 30 seconds for changes to propagate

**To find your current IP:**
- Visit: https://whatismyip.com
- Copy the IP address shown
- Add it to Atlas Network Access

### Step 3: Check Database Access (User Permissions)

1. In Atlas, click **Database Access** in left sidebar
2. Verify user `Lev` exists
3. Click the user to check permissions

**If user doesn't exist or permissions are wrong:**
1. Click **"Add New Database User"**
2. Authentication Method: Password
3. Username: `Lev`
4. Password: `tkp7cZ3I02U3C8ds`
5. Database User Privileges: Read and write to any database
6. Click **"Add User"**

### Step 4: Get Fresh Connection String

1. Click your cluster name
2. Click **"Connect"**
3. Choose **"Connect your application"**
4. Driver: Node.js
5. Version: 4.1 or later
6. Copy the connection string

**Format should look like:**
```
mongodb+srv://Lev:tkp7cZ3I02U3C8ds@cluster0.4fwnktm.mongodb.net/?retryWrites=true&w=majority
```

### Step 5: Test Connection from Atlas

Atlas has a built-in connection tester:

1. Click **"Connect"** on your cluster
2. Choose **"Connect with MongoDB Shell"**
3. Click **"I have the MongoDB Shell"** (even if you don't)
4. This will show if Atlas can connect from their end
5. If this fails, the issue is with your cluster/network

### Step 6: Check DNS Resolution

Test if your computer can resolve the MongoDB DNS:

**Windows:**
```cmd
nslookup cluster0.4fwnktm.mongodb.net
```

**Mac/Linux:**
```bash
dig cluster0.4fwnktm.mongodb.net
```

**If DNS fails:**
- Try different network (WiFi vs mobile hotspot)
- Check if firewall/antivirus is blocking
- Try from a different computer
- Check if corporate VPN is interfering

### Step 7: Try Alternative Connection Format

Sometimes the SRV record fails. Try the direct connection:

1. In Atlas, click **"Connect"**
2. Choose **"Connect your application"**
3. Click **"Advanced Connection Options"**
4. Select **"Direct Connection"** instead of SRV
5. Copy that connection string
6. Update your `.env` file

### Step 8: Check Firewall/Antivirus

Some firewalls block MongoDB Atlas:

1. Temporarily disable firewall/antivirus
2. Test connection again
3. If it works, add exception for MongoDB
4. Re-enable firewall/antivirus

### Step 9: Try from Different Network

DNS resolution might be network-specific:

1. Try mobile hotspot
2. Try different WiFi
3. Try from a different location
4. Check if office/school network has restrictions

### Step 10: Verify Cluster is in Correct Region

Sometimes regional blocks exist:

1. Check your cluster region in Atlas
2. If it's in a restricted region, consider:
   - Creating a new cluster in a different region
   - Using a VPN to that region

## Common Solutions

### Solution 1: Cluster Was Paused
**Problem:** Cluster shows paused state
**Fix:** Click "Resume" button in Atlas

### Solution 2: IP Not Whitelisted
**Problem:** IP not in Network Access
**Fix:** Add your IP or use "Allow Access from Anywhere"

### Solution 3: DNS Issues
**Problem:** DNS resolution fails
**Fix:** Try different network, check firewall, use direct connection

### Solution 4: User Permissions
**Problem:** User doesn't have correct permissions
**Fix:** Recreate user with "Read and write to any database"

### Solution 5: Network Blocking
**Problem:** Network blocks MongoDB
**Fix:** Try different network, configure firewall, use VPN

## Test Connection After Changes

After making any changes, wait 30-60 seconds for Atlas to propagate, then:

```bash
cd server
node test-mongodb.js
```

## Still Not Working?

### Alternative: Use MongoDB Compass (GUI Tool)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install and open
3. Paste your connection string
4. Click Connect
5. If Compass works, the issue is with Node.js/dns
6. If Compass fails, the issue is with Atlas/network

### Contact MongoDB Support

If nothing works:
- Free tier: Community forums
- Paid tier: Official support
- Atlas Dashboard: Create support ticket

## Fallback: Use Mock Mode

If Atlas still doesn't work, you can:
- Keep using mock mode for development
- Try Atlas again later from different network
- Deploy to Railway/Render and use their MongoDB (often works better)
