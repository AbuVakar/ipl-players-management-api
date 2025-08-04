import mongoose from 'mongoose';
import Player from './src/models/player.model.js';
import connectDB from './src/config/db.js';
import path from 'path';
import fs from 'fs';

// Sample player data
const players = [
  {
    name: 'Virat Kohli',
    team: 'RCB',
    country: 'India',
    runs: 12000,
    salary: 15000000,
    role: 'Batsman'
  },
  {
    name: 'MS Dhoni',
    team: 'CSK',
    country: 'India',
    runs: 8000,
    salary: 12000000,
    role: 'Wicket-Keeper'
  },
  {
    name: 'Rohit Sharma',
    team: 'MI',
    country: 'India',
    runs: 9000,
    salary: 14000000,
    role: 'Batsman'
  },
  {
    name: 'Jasprit Bumrah',
    team: 'MI',
    country: 'India',
    runs: 200,
    salary: 10000000,
    role: 'Bowler'
  },
  {
    name: 'AB de Villiers',
    team: 'RCB',
    country: 'South Africa',
    runs: 10000,
    salary: 11000000,
    role: 'Batsman'
  }
];

const seedPlayers = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Player.deleteMany();
    console.log('✅ Existing players deleted');
    
    // Insert new data
    await Player.insertMany(players);
    console.log('✅ Players seeded successfully');
    
    // Get the list of players
    const playerList = await Player.find({});
    console.log(`Total players: ${playerList.length}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding players:', error);
    process.exit(1);
  }
};

seedPlayers();
