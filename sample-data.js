// Sample IPL Players Data for Testing
// You can use this data to populate your database for testing

const samplePlayers = [
  {
    name: "Virat Kohli",
    team: "RCB",
    country: "India",
    runs: 6624,
    role: "Batsman",
    salary: 150000000,
    image: "http://localhost:3000/uploads/virat-kohli.jpg"
  },
  {
    name: "Rohit Sharma",
    team: "MI",
    country: "India",
    runs: 5879,
    role: "Batsman",
    salary: 140000000,
    image: "http://localhost:3000/uploads/rohit-sharma.jpg"
  },
  {
    name: "MS Dhoni",
    team: "CSK",
    country: "India",
    runs: 4632,
    role: "Batsman",
    salary: 120000000,
    image: "http://localhost:3000/uploads/ms-dhoni.jpg"
  },
  {
    name: "Jasprit Bumrah",
    team: "MI",
    country: "India",
    runs: 0,
    role: "Bowler",
    salary: 120000000,
    image: "http://localhost:3000/uploads/jasprit-bumrah.jpg"
  },
  {
    name: "Rashid Khan",
    team: "GT",
    country: "Afghanistan",
    runs: 139,
    role: "Bowler",
    salary: 90000000,
    image: "http://localhost:3000/uploads/rashid-khan.jpg"
  },
  {
    name: "Andre Russell",
    team: "KKR",
    country: "West Indies",
    runs: 1897,
    role: "All-rounder",
    salary: 120000000,
    image: "http://localhost:3000/uploads/andre-russell.jpg"
  },
  {
    name: "Hardik Pandya",
    team: "GT",
    country: "India",
    runs: 1963,
    role: "All-rounder",
    salary: 110000000,
    image: "http://localhost:3000/uploads/hardik-pandya.jpg"
  },
  {
    name: "KL Rahul",
    team: "LSG",
    country: "India",
    runs: 3889,
    role: "Batsman",
    salary: 110000000,
    image: "http://localhost:3000/uploads/kl-rahul.jpg"
  },
  {
    name: "David Warner",
    team: "DC",
    country: "Australia",
    runs: 5881,
    role: "Batsman",
    salary: 125000000,
    image: "http://localhost:3000/uploads/david-warner.jpg"
  },
  {
    name: "Jos Buttler",
    team: "RR",
    country: "England",
    runs: 2713,
    role: "Batsman",
    salary: 100000000,
    image: "http://localhost:3000/uploads/jos-buttler.jpg"
  },
  {
    name: "Ravindra Jadeja",
    team: "CSK",
    country: "India",
    runs: 2502,
    role: "All-rounder",
    salary: 160000000,
    image: "http://localhost:3000/uploads/ravindra-jadeja.jpg"
  },
  {
    name: "Yuzvendra Chahal",
    team: "RR",
    country: "India",
    runs: 0,
    role: "Bowler",
    salary: 65000000,
    image: "http://localhost:3000/uploads/yuzvendra-chahal.jpg"
  },
  {
    name: "Shubman Gill",
    team: "GT",
    country: "India",
    runs: 1377,
    role: "Batsman",
    salary: 80000000,
    image: "http://localhost:3000/uploads/shubman-gill.jpg"
  },
  {
    name: "Suryakumar Yadav",
    team: "MI",
    country: "India",
    runs: 2101,
    role: "Batsman",
    salary: 80000000,
    image: "http://localhost:3000/uploads/suryakumar-yadav.jpg"
  },
  {
    name: "Mohammed Shami",
    team: "GT",
    country: "India",
    runs: 0,
    role: "Bowler",
    salary: 65000000,
    image: "http://localhost:3000/uploads/mohammed-shami.jpg"
  }
];

// Function to populate database with sample data
async function populateSampleData(Player) {
  console.log('📊 Populating database with sample players...');
  
  for (const playerData of samplePlayers) {
    try {
      await Player.create(playerData);
      console.log(`✅ Added: ${playerData.name} (${playerData.team})`);
    } catch (error) {
      console.error(`❌ Failed to add ${playerData.name}:`, error.message);
    }
  }
  
  console.log('🎉 Sample data population completed!');
}

// Function to clear all data
async function clearAllData(Player) {
  console.log('🗑️ Clearing all player data...');
  
  try {
    const result = await Player.collection.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} players`);
  } catch (error) {
    console.error('❌ Failed to clear data:', error.message);
  }
}

module.exports = {
  samplePlayers,
  populateSampleData,
  clearAllData
};

// Usage example:
// const { populateSampleData, clearAllData } = require('./sample-data');
// 
// // To populate with sample data:
// await populateSampleData(Player);
// 
// // To clear all data:
// await clearAllData(Player); 