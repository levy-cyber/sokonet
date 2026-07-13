require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection...\n');

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    console.log('💡 Please add MONGODB_URI to your .env file');
    console.log('💡 Example: mongodb+srv://username:password@cluster0.mongodb.net/Netsoko');
    process.exit(1);
  }

  console.log('📡 Connection String:', process.env.MONGODB_URI.replace(/:.*@/, ':****@'));
  console.log('');

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });

    console.log('✅ MongoDB Atlas Connected Successfully!\n');

    // Get connection info
    const db = mongoose.connection;
    console.log('📊 Database Information:');
    console.log('   - Host:', db.host);
    console.log('   - Port:', db.port);
    console.log('   - Name:', db.name);
    console.log('   - State:', db.readyState === 1 ? 'Connected' : 'Disconnected');
    console.log('');

    // List collections
    console.log('📚 Collections in database:');
    const collections = await db.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('   - No collections yet (will be created by your app)');
    } else {
      collections.forEach(collection => {
        console.log('   -', collection.name);
      });
    }
    console.log('');

    // Test a simple operation
    console.log('🧪 Testing database operation...');
    const TestModel = mongoose.model('TestConnection', new mongoose.Schema({
      timestamp: { type: Date, default: Date.now },
      status: String
    }));

    const testDoc = await TestModel.create({ status: 'connected' });
    console.log('   - Created test document:', testDoc._id);
    
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('   - Deleted test document');
    console.log('✅ Database operations working correctly!\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected successfully\n');
    
    console.log('🎉 MongoDB Atlas setup is complete!');
    console.log('💡 You can now start your server with: npm start');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:\n');
    console.error('   Message:', error.message);
    console.error('');
    
    if (error.message.includes('Authentication failed')) {
      console.log('💡 Troubleshooting:');
      console.log('   - Check username and password in connection string');
      console.log('   - Ensure password is URL-encoded if it has special characters');
      console.log('   - Verify user exists in MongoDB Atlas Database Access');
    } else if (error.message.includes('IP not whitelisted')) {
      console.log('💡 Troubleshooting:');
      console.log('   - Add your IP to Network Access in MongoDB Atlas');
      console.log('   - Or enable "Allow Access from Anywhere" (less secure)');
    } else if (error.message.includes('getaddrinfo') || error.message.includes('ENOTFOUND')) {
      console.log('💡 Troubleshooting:');
      console.log('   - Check your internet connection');
      console.log('   - Ensure you are using mongodb+srv:// (not mongodb://)');
      console.log('   - Verify cluster name is correct');
    } else if (error.message.includes('queryTxt')) {
      console.log('💡 Troubleshooting:');
      console.log('   - Check DNS settings');
      console.log('   - Ensure cluster is running in Atlas');
    }
    
    console.log('');
    console.log('📖 For detailed setup guide, see: MONGODB_ATLAS_SETUP.md');
    
    process.exit(1);
  }
}

// Run the test
testConnection();
