# IPL Players Management API - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### 1. Clone and Install
```bash
# Navigate to project directory
cd IPL_Player

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/ipl_players

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ipl_players
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 4. Run the Application
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 5. Verify Installation
- Server will start on `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- API base URL: `http://localhost:3000/api`

## 📊 Populate Sample Data

To add sample IPL players for testing:

```bash
# Run the data population script
node scripts/populate-data.js
```

This will add 15 sample players including:
- Virat Kohli (RCB)
- Rohit Sharma (MI)
- MS Dhoni (CSK)
- And many more...

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing with curl

#### 1. List Players
```bash
curl http://localhost:3000/api/players
```

#### 2. Create Player
```bash
curl -X POST http://localhost:3000/api/players \
  -F "name=Test Player" \
  -F "team=Test Team" \
  -F "country=Test Country" \
  -F "runs=1000" \
  -F "role=Batsman" \
  -F "salary=50000000"
```

#### 3. Get Player Description
```bash
# Replace PLAYER_ID with actual ID from list response
curl http://localhost:3000/api/players/PLAYER_ID/description
```

#### 4. Update Player
```bash
curl -X PATCH http://localhost:3000/api/players/PLAYER_ID \
  -F "runs=1500" \
  -F "salary=60000000"
```

#### 5. Delete Player
```bash
curl -X DELETE http://localhost:3000/api/players/PLAYER_ID
```

## 🔧 Configuration

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `MONGODB_URI` | mongodb://localhost:27017/ipl_players | MongoDB connection string |
| `NODE_ENV` | development | Environment mode |
| `BASE_URL` | http://localhost:3000 | Base URL for image URLs |

### Database Configuration
The application uses MongoDB with the following collections:
- `players`: Stores player information

Indexes are automatically created for:
- Text search on player names
- Team filtering
- Runs and salary sorting

## 📁 Project Structure

```
IPL_Player/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/
│   │   └── player.js            # Player model and methods
│   ├── routes/
│   │   └── players.js           # API routes
│   ├── middleware/
│   │   ├── validation.js        # Request validation
│   │   └── errorHandler.js      # Error handling
│   ├── utils/
│   │   └── imageProcessor.js    # Image processing
│   └── server.js                # Main server file
├── scripts/
│   └── populate-data.js         # Sample data population
├── uploads/                     # Image storage
├── test/                        # Test files
├── package.json
├── README.md
├── API_DOCUMENTATION.md
└── SETUP_GUIDE.md
```

## 🛠️ Development

### Adding New Features
1. Create new routes in `src/routes/`
2. Add validation schemas in `src/middleware/validation.js`
3. Update models in `src/models/`
4. Add tests in `test/`

### Code Style
- Use ES6+ features
- Follow Fastify conventions
- Add proper error handling
- Include input validation
- Write tests for new features

## 🚨 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running and the connection string is correct.

#### 2. Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution**: Change the PORT in .env file or kill the process using port 3000.

#### 3. Image Upload Issues
```
Error: File size too large
```
**Solution**: Ensure image is under 5MB and in supported format (JPEG, PNG, WebP).

#### 4. Validation Errors
```
Error: Validation Error
```
**Solution**: Check that all required fields are provided and data types are correct.

### Debug Mode
To enable debug logging, set in .env:
```
NODE_ENV=development
```

## 📚 API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 