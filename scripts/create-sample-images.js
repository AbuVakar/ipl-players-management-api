const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Sample players data
const players = [
  { name: "Virat Kohli", team: "RCB" },
  { name: "Rohit Sharma", team: "MI" },
  { name: "MS Dhoni", team: "CSK" },
  { name: "Jasprit Bumrah", team: "MI" },
  { name: "Rashid Khan", team: "GT" },
  { name: "Andre Russell", team: "KKR" },
  { name: "Hardik Pandya", team: "GT" },
  { name: "KL Rahul", team: "LSG" },
  { name: "David Warner", team: "DC" },
  { name: "Jos Buttler", team: "RR" },
  { name: "Ravindra Jadeja", team: "CSK" },
  { name: "Yuzvendra Chahal", team: "RR" },
  { name: "Shubman Gill", team: "GT" },
  { name: "Suryakumar Yadav", team: "MI" },
  { name: "Mohammed Shami", team: "GT" }
];

async function createSampleImages() {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  // Ensure uploads directory exists
  try {
    await fs.access(uploadsDir);
  } catch (error) {
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  console.log('🎨 Creating sample player images...');

  for (const player of players) {
    const filename = `${player.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const filepath = path.join(uploadsDir, filename);

    // Create a simple placeholder image with player name and team
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#1e40af"/>
        <circle cx="150" cy="100" r="40" fill="#fbbf24"/>
        <text x="150" y="180" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${player.name}</text>
        <text x="150" y="200" text-anchor="middle" fill="#fbbf24" font-family="Arial" font-size="14">${player.team}</text>
        <text x="150" y="220" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">IPL Player</text>
      </svg>
    `;

    try {
      // Convert SVG to JPEG using Sharp
      await sharp(Buffer.from(svg))
        .resize(300, 300)
        .jpeg({ quality: 80 })
        .toFile(filepath);

      console.log(`✅ Created: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to create ${filename}:`, error.message);
    }
  }

  console.log('🎉 Sample images created successfully!');
}

// Run the script
createSampleImages().catch(console.error); 