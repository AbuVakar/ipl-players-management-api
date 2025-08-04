require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl';
    
    console.log('Connection URI:', uri);
    
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB Connected to:', conn.connection.host);
    
    // Test a simple query
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error code name:', error.codeName);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nTroubleshooting tips:');
      console.error('1. Is MongoDB running? Try: net start MongoDB');
      console.error('2. Check if the connection string is correct');
      console.error('3. Try connecting with MongoDB Compass or mongo shell');
    }
    
    process.exit(1);
  }
}

testConnection();
