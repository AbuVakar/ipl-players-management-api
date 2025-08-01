const database = require('../src/config/database');
const Player = require('../src/models/player');
const { populateSampleData } = require('../sample-data');

async function main() {
  try {
    console.log('🚀 Starting data population script...');
    
    // Connect to database
    await database.connect();
    console.log('✅ Connected to database');
    
    // Create Player model instance
    const playerModel = new Player(database.getDb());
    
    // Populate with sample data
    await populateSampleData(playerModel);
    
    console.log('🎉 Data population completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during data population:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await database.disconnect();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
main(); 