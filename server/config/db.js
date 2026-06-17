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
  jobs: [],
  services: [],
  bookings: []
};

// Enable mock mode if no MONGODB_URI or MOCK_MODE=true
const USE_MOCK = process.env.MOCK_MODE === 'true' || !process.env.MONGODB_URI;

// Database connection monitoring
let connectionRetries = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async () => {
  if (USE_MOCK) {
    console.log('🧪 Running in MOCK MODE (No MongoDB)');
    console.log('📊 Using in-memory data storage for testing');
    initializeMockData();
    return;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Netsoko';

  // MongoDB connection options for Atlas
  const options = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    retryReads: true,
    // Enable automatic reconnection
    autoIndex: true,
    autoCreate: true,
  };

  try {
    console.log('🔌 Attempting to connect to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    // Reset retry counter on successful connection
    connectionRetries = 0;

    return conn;
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    console.error(`🔍 Error Details: ${error.name}`);
    
    connectionRetries++;
    
    if (connectionRetries < MAX_RETRIES) {
      console.log(`🔄 Retry attempt ${connectionRetries}/${MAX_RETRIES} in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(); // Retry connection
    } else {
      console.log(`❌ Max retries (${MAX_RETRIES}) reached. Falling back to MOCK MODE...`);
      console.log('🧪 Using in-memory data storage for testing');
      initializeMockData();
      return;
    }
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
      role: 'buyer',
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
    },
    {
      _id: 'provider1',
      name: 'QuickFix Services',
      email: 'provider@example.com',
      phone: '+254700000001',
      password: '$2a$10$hash',
      role: 'service_provider',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 4.6,
      createdAt: new Date()
    },
    {
      _id: 'rider1',
      name: 'John Rider',
      email: 'rider@example.com',
      phone: '+254711223344',
      password: '$2a$10$hash',
      role: 'rider',
      avatar: 'https://i.pravatar.cc/150?img=4',
      rating: 4.9,
      createdAt: new Date()
    },
    {
      _id: 'freelancer1',
      name: 'Creative Freelancer',
      email: 'freelancer@example.com',
      phone: '+254755556666',
      password: '$2a$10$hash',
      role: 'freelancer',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 4.7,
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

  // Mock Services (for service providers)
  mockDB.services = [
    {
      _id: 'service1',
      provider: 'provider1',
      name: 'Plumbing Repair',
      description: 'Expert plumbing services for homes and businesses',
      category: 'Home Services',
      price: 2500,
      images: ['https://images.unsplash.com/photo-1585704032915-c3400ca1e126?w=400'],
      ratings: [{ user: 'user1', rating: 5, comment: 'Excellent service!' }],
      available: true,
      createdAt: new Date()
    }
  ];

  // Mock Bookings (for service providers)
  mockDB.bookings = [
    {
      _id: 'booking1',
      service: 'service1',
      customer: 'user1',
      provider: 'provider1',
      date: new Date(Date.now() + 86400000),
      status: 'confirmed',
      amount: 2500,
      createdAt: new Date()
    }
  ];

  // Mock Jobs (for freelancers)
  mockDB.jobs = [
    {
      _id: 'job1',
      title: 'Web Development Project',
      description: 'Looking for a React developer for e-commerce site',
      budget: 50000,
      category: 'Development',
      client: 'seller1',
      status: 'open',
      applications: [],
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
  },

  // Service operations (for service providers)
  findServices: (query = {}) => {
    let results = [...mockDB.services];
    if (query.category) results = results.filter(s => s.category === query.category);
    if (query.provider) results = results.filter(s => s.provider === query.provider);
    return results;
  },

  createService: (serviceData) => {
    const newService = {
      _id: 'service' + Date.now(),
      ...serviceData,
      createdAt: new Date()
    };
    mockDB.services.push(newService);
    return newService;
  },

  // Booking operations
  findBookings: (userId) => {
    return mockDB.bookings.filter(b => b.customer === userId || b.provider === userId);
  },

  createBooking: (bookingData) => {
    const newBooking = {
      _id: 'booking' + Date.now(),
      ...bookingData,
      createdAt: new Date()
    };
    mockDB.bookings.push(newBooking);
    return newBooking;
  },

  // Job operations (for freelancers)
  findJobs: (query = {}) => {
    let results = [...mockDB.jobs];
    if (query.category) results = results.filter(j => j.category === query.category);
    if (query.status) results = results.filter(j => j.status === query.status);
    return results;
  },

  createJob: (jobData) => {
    const newJob = {
      _id: 'job' + Date.now(),
      ...jobData,
      createdAt: new Date()
    };
    mockDB.jobs.push(newJob);
    return newJob;
  }
};

// Create indexes for optimal performance
const createIndexes = async () => {
  if (USE_MOCK) return;

  try {
    console.log('🔍 Creating database indexes...');

    // User indexes
    await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.collection('users').createIndex({ phone: 1 }, { unique: true });
    await mongoose.connection.collection('users').createIndex({ status: 1 });
    await mongoose.connection.collection('users').createIndex({ deletedAt: 1 });

    // Product indexes
    await mongoose.connection.collection('products').createIndex({ seller: 1 });
    await mongoose.connection.collection('products').createIndex({ category: 1 });
    await mongoose.connection.collection('products').createIndex({ status: 1 });
    await mongoose.connection.collection('products').createIndex({ createdAt: -1 });

    // Service indexes
    await mongoose.connection.collection('services').createIndex({ provider: 1 });
    await mongoose.connection.collection('services').createIndex({ category: 1 });
    await mongoose.connection.collection('services').createIndex({ status: 1 });
    await mongoose.connection.collection('services').createIndex({ availability: 1 });

    // Job indexes
    await mongoose.connection.collection('jobs').createIndex({ employer: 1 });
    await mongoose.connection.collection('jobs').createIndex({ category: 1 });
    await mongoose.connection.collection('jobs').createIndex({ status: 1 });
    await mongoose.connection.collection('jobs').createIndex({ createdAt: -1 });

    // Support ticket indexes
    await mongoose.connection.collection('supporttickets').createIndex({ user: 1 });
    await mongoose.connection.collection('supporttickets').createIndex({ status: 1 });
    await mongoose.connection.collection('supporttickets').createIndex({ priority: 1 });
    await mongoose.connection.collection('supporttickets').createIndex({ createdAt: -1 });

    // Activity log indexes
    await mongoose.connection.collection('activitylogs').createIndex({ user: 1 });
    await mongoose.connection.collection('activitylogs').createIndex({ action: 1 });
    await mongoose.connection.collection('activitylogs').createIndex({ createdAt: -1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
    // Don't fail the connection if index creation fails
  }
};

// Monitor database connection health
const monitorConnection = () => {
  setInterval(() => {
    if (mongoose.connection.readyState === 1) {
      console.log('💚 MongoDB connection is healthy');
    } else {
      console.log('⚠️ MongoDB connection state:', mongoose.connection.readyState);
    }
  }, 300000); // Check every 5 minutes
};

module.exports = { connectDB, USE_MOCK, mockDB, mockHelpers, createIndexes, monitorConnection };
