const User = require('../models/User');
const Wallet = require('../models/Wallet');
const CompanyTill = require('../models/CompanyTill');
const { USE_MOCK } = require('../config/db');

// @desc    Get all users with wallet details
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    let users;
    
    if (USE_MOCK) {
      // Mock data for development
      users = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '0712345678',
          role: 'buyer',
          roles: ['buyer'],
          activeRole: 'buyer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
          wallet: {
            balance: 50000,
            currency: 'KES',
          },
          bankAccount: {
            paybill: '247247',
            account: '0870185429080',
          },
          createdAt: new Date(),
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '0723456789',
          role: 'seller',
          roles: ['seller'],
          activeRole: 'seller',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
          wallet: {
            balance: 125000,
            currency: 'KES',
          },
          bankAccount: {
            paybill: '247247',
            account: '0870185429080',
          },
          createdAt: new Date(),
        },
      ];
    } else {
      users = await User.find({}).select('-password');
      
      // Get wallet details for each user
      for (let user of users) {
        const wallet = await Wallet.findOne({ user: user._id });
        user.wallet = wallet || { balance: 0, currency: 'KES' };
        user.bankAccount = {
          paybill: process.env.BANK_PAYBILL || '247247',
          account: process.env.BANK_ACCOUNT || '0870185429080',
        };
      }
    }

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get company till details
// @route   GET /api/admin/till
// @access  Admin
const getCompanyTill = async (req, res) => {
  try {
    let till;
    
    if (USE_MOCK) {
      till = {
        _id: 'till1',
        name: 'Company Till',
        balance: 5000000,
        currency: 'KES',
        transactions: [
          {
            type: 'deposit',
            amount: 1000000,
            description: 'Initial deposit',
            reference: 'INIT_DEP',
            status: 'completed',
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
      };
    } else {
      till = await CompanyTill.findOne();
      
      if (!till) {
        till = await CompanyTill.create({
          name: 'Company Till',
          balance: 0,
          currency: 'KES',
        });
      }
    }

    res.json({
      success: true,
      data: till,
    });
  } catch (error) {
    console.error('Get company till error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add funds to company till
// @route   POST /api/admin/till/deposit
// @access  Admin
const depositToTill = async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  try {
    let till;
    
    if (USE_MOCK) {
      till = {
        _id: 'till1',
        name: 'Company Till',
        balance: 5000000 + Number(amount),
        currency: 'KES',
        transactions: [
          {
            type: 'deposit',
            amount: Number(amount),
            description: description || 'Manual deposit',
            reference: `TILL_DEP${Date.now()}`,
            status: 'completed',
            createdAt: new Date(),
          },
        ],
      };
    } else {
      till = await CompanyTill.findOne();
      
      if (!till) {
        till = await CompanyTill.create({
          name: 'Company Till',
          balance: 0,
          currency: 'KES',
        });
      }

      till.balance += Number(amount);
      till.transactions.push({
        type: 'deposit',
        amount: Number(amount),
        description: description || 'Manual deposit',
        reference: `TILL_DEP${Date.now()}`,
        status: 'completed',
        createdAt: new Date(),
      });

      await till.save();
    }

    res.json({
      success: true,
      data: till,
      message: `Successfully deposited KES ${amount} to company till`,
    });
  } catch (error) {
    console.error('Deposit to till error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getCompanyTill,
  depositToTill,
};
