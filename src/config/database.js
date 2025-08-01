const { MongoClient } = require('mongodb');
require('dotenv').config();

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      this.client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/ipl_players');
      await this.client.connect();
      this.db = this.client.db();
      console.log('✅ Connected to MongoDB successfully');
      
      // Create indexes for better performance
      await this.db.collection('players').createIndex({ name: 'text' });
      await this.db.collection('players').createIndex({ team: 1 });
      await this.db.collection('players').createIndex({ runs: -1 });
      await this.db.collection('players').createIndex({ salary: -1 });
      
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  getDb() {
    return this.db;
  }
}

module.exports = new Database(); 