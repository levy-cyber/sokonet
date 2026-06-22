/**
 * Seed Script: Create Super Admin and Support Accounts
 * Run: node scripts/seedAdminAccounts.js
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Lev:tkp7cZ3I02U3C8ds@cluster0.4fwnktm.mongodb.net/sokonet?retryWrites=true&w=majority';

// Enable mock mode if MongoDB connection fails
const USE_MOCK = process.env.MOCK_MODE === 'true' || !process.env.MONGODB_URI;

const adminAccounts = [
  {
    name: 'Netsoko Super Admin',
    email: 'admin@netsoko.co.ke',
    phone: '0700000001',
    password: 'bignetsoko@9625white',
    role: 'admin',
    roles: ['admin'],
    activeRole: 'admin',
    isSuperAdmin: true,
    isSupport: false,
    isEmailVerified: true,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=00C853&color=fff&size=150',
  },
  {
    name: 'Netsoko Support',
    email: 'support@sokonet.co.ke',
    phone: '0700000002',
    password: 'levnetsoko@9625blue',
    role: 'support',
    roles: ['support'],
    activeRole: 'support',
    isSuperAdmin: false,
    isSupport: true,
    isEmailVerified: true,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Support+Team&background=2196F3&color=fff&size=150',
  },
];

async function seedAdminAccounts() {
  try {
    if (USE_MOCK) {
      console.log('🧪 Running in MOCK MODE - admin accounts will be available in memory only');
      console.log('⚠️  To seed admin accounts in production database, run with MONGODB_URI set');
      console.log('\n🎉 Mock admin accounts available:');
      console.log('Super Admin: admin@netsoko.co.ke / bignetsoko@9625white');
      console.log('Support:     support@sokonet.co.ke / levnetsoko@9625blue');
      process.exit(0);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const account of adminAccounts) {
      const existing = await User.findOne({ email: account.email });

      if (existing) {
        // Update existing account to ensure correct flags
        existing.isSuperAdmin = account.isSuperAdmin;
        existing.isSupport = account.isSupport;
        existing.role = account.role;
        existing.roles = account.roles;
        existing.activeRole = account.activeRole;
        existing.status = 'active';
        existing.isEmailVerified = true;
        existing.accountStatus = 'active';
        existing.hasLoggedIn = true;
        // Reset password
        existing.password = account.password;
        await existing.save();
        console.log(`🔄 Updated existing account: ${account.email}`);
      } else {
        const user = await User.create({
          ...account,
          accountStatus: 'active',
          hasLoggedIn: true
        });
        // Create wallet
        await Wallet.create({ user: user._id, balance: 0 });
        console.log(`✅ Created account: ${account.email} (${account.isSuperAdmin ? 'Super Admin' : 'Support'})`);
      }
    }

    console.log('\n🎉 Admin accounts seeded successfully!');
    console.log('Super Admin: admin@netsoko.co.ke / bignetsoko@9625white');
    console.log('Support:     support@sokonet.co.ke / levnetsoko@9625blue');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    console.error('💡 Tip: If MongoDB connection failed, the app will run in mock mode with admin accounts available');
    process.exit(1);
  }
}

seedAdminAccounts();
