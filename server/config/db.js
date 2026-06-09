const mongoose = require('mongoose');

// Mock data store for testing without MongoDB
const mockDB = {
  users: [],
  products: [],
  orders: [],
  wallets: [],
  escrows: [],
  messages: [],
  notifications: [],
  riders: [],
  shops: [],
  jobs: []
};

// Enable mock mode if no MONGODB_URI or MOCK_MODE=true
const USE_MOCK = process.env.MOCK_MODE === 'true' || !process.env.MONGODB_URI;

const connectDB = async () => {
  if (USE_MOCK) {
    console.log('🧪 Running in MOCK MODE (No MongoDB)');
    console.log('📊 Using in-memory data storage for testing');
    initializeMockData();
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sokonet', {
      // MongoDB Atlas recommended options
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.log('🧪 Falling back to MOCK MODE for testing...');
    initializeMockData();
  }
};

// Initialize mock data for testing
function initializeMockData() {
  // Mock Users
  mockDB.users = [
    {
      _id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+254712345678',
      password: '$2a$10$hash', // Would be bcrypt hash in real
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 4.5,
      createdAt: new Date()
    },
    {
      _id: 'seller1',
      name: 'Tech Store Kenya',
      email: 'seller@example.com',
      phone: '+254798765432',
      password: '$2a$10$hash',
      role: 'seller',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4.8,
      createdAt: new Date()
    }
  ];

  // Mock Products
  mockDB.products = [
    {
      _id: 'prod1',
      name: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with amazing features',
      price: 185000,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'],
      seller: 'seller1',
      ratings: [
        { user: 'user1', rating: 5, comment: 'Great phone!' }
      ],
      stock: 10,
      createdAt: new Date()
    },
    {
      _id: 'prod2',
      name: 'Samsung Galaxy S24',
      description: 'Samsung flagship smartphone',
      price: 175000,
      category: 'Electronics',
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'],
      seller: 'seller1',
      ratings: [{ user: 'user1', rating: 4, comment: 'Good value' }],
      stock: 15,
      createdAt: new Date()
    },
    {
      _id: 'prod3',
      name: 'Nike Air Max',
      description: 'Comfortable running shoes',
      price: 18500,
      category: 'Fashion',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      seller: 'seller1',
      ratings: [],
      stock: 20,
      createdAt: new Date()
    }
  ];

  // Mock Wallets
  mockDB.wallets = [
    {
      _id: 'wallet1',
      user: 'user1',
      balance: 50000,
      currency: 'KES',
      transactions: [
        {
          type: 'deposit',
          amount: 50000,
          status: 'completed',
          reference: 'INITIAL',
          createdAt: new Date()
        }
      ],
      createdAt: new Date()
    }
  ];

  // Mock Orders
  mockDB.orders = [
    {
      _id: 'order1',
      buyer: 'user1',
      seller: 'seller1',
      product: 'prod1',
      amount: 185000,
      currency: 'KES',
      status: 'pending',
      rider: null,
      escrow: null,
      createdAt: new Date()
    }
  ];

  // Mock Riders
  mockDB.riders = [
    {
      _id: 'rider1',
      name: 'John Rider',
      phone: '+254711223344',
      vehicle: 'Motorcycle',
      earnings: 15000,
      active: true,
      createdAt: new Date()
    }
  ];

  // Mock Messages
  mockDB.messages = [
    {
      _id: 'msg1',
      sender: 'seller1',
      receiver: 'user1',
      content: 'Your order has been shipped!',
      read: false,
      createdAt: new Date()
    }
  ];

  // Mock Notifications
  mockDB.notifications = [
    {
      _id: 'notif1',
      user: 'user1',
      type: 'order',
      message: 'Your order status has changed',
      read: false,
      createdAt: new Date()
    }
  ];

  console.log('✅ Mock data initialized with test data');
}

// Helper functions for mock data operations
const mockHelpers = {
  // User operations
  findUser: (query) => {
    if (query.email) return mockDB.users.find(u => u.email === query.email);
    if (query._id) return mockDB.users.find(u => u._id === query._id);
    return mockDB.users.filter(u => Object.keys(query).every(key => u[key] === query[key]));
  },

  createUser: (userData) => {
    const newUser = {
      _id: 'user' + Date.now(),
      ...userData,
      createdAt: new Date()
    };
    mockDB.users.push(newUser);
    
    // Create wallet for new user
    mockDB.wallets.push({
      _id: 'wallet' + Date.now(),
      user: newUser._id,
      balance: 1000, // Sign up bonus
      currency: 'KES',
      transactions: [{
        type: 'deposit',
        amount: 1000,
        status: 'completed',
        reference: 'SIGNUP_BONUS',
        createdAt: new Date()
      }],
      createdAt: new Date()
    });
    
    return newUser;
  },

  // Product operations
  findProducts: (query = {}) => {
    let results = [...mockDB.products];
    if (query.category) results = results.filter(p => p.category === query.category);
    if (query.search) results = results.filter(p => p.name.toLowerCase().includes(query.search.toLowerCase()));
    if (query.seller) results = results.filter(p => p.seller === query.seller);
    return results;
  },

  findProductById: (id) => mockDB.products.find(p => p._id === id),

  createProduct: (productData) => {
    const newProduct = {
      _id: 'prod' + Date.now(),
      ...productData,
      createdAt: new Date()
    };
    mockDB.products.push(newProduct);
    return newProduct;
  },

  // Wallet operations
  findWallet: (userId) => mockDB.wallets.find(w => w.user === userId),

  updateWallet: (userId, updates) => {
    const walletIndex = mockDB.wallets.findIndex(w => w.user === userId);
    if (walletIndex !== -1) {
      mockDB.wallets[walletIndex] = { ...mockDB.wallets[walletIndex], ...updates };
      return mockDB.wallets[walletIndex];
    }
    return null;
  },

  // Order operations
  findOrders: (userId) => {
    return mockDB.orders.filter(o => o.buyer === userId || o.seller === userId);
  },

  createOrder: (orderData) => {
    const newOrder = {
      _id: 'order' + Date.now(),
      ...orderData,
      createdAt: new Date()
    };
    mockDB.orders.push(newOrder);
    return newOrder;
  },

  // Message operations
  findMessages: (userId) => {
    return mockDB.messages.filter(m => m.sender === userId || m.receiver === userId);
  },

  createMessage: (messageData) => {
    const newMessage = {
      _id: 'msg' + Date.now(),
      ...messageData,
      createdAt: new Date()
    };
    mockDB.messages.push(newMessage);
    return newMessage;
  }
};

module.exports = { connectDB, USE_MOCK, mockDB, mockHelpers };
