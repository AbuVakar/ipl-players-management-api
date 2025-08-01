# IPL Players Management API

A RESTful API for managing IPL players built with Node.js, Fastify, and MongoDB.

## Features

- ✅ List all players with pagination and filtering
- ✅ Create new players with image upload
- ✅ Update existing players
- ✅ Delete players
- ✅ Get detailed player descriptions
- ✅ Search players by name
- ✅ Sort players by runs or salary
- ✅ Input validation using Joi
- ✅ Error handling
- ✅ Image processing with Sharp

## API Endpoints

### 1. List All Players
- **GET** `/players`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `team` (optional filter)
  - `search` (optional search by name)
  - `sortBy` (runs or salary)
  - `sortOrder` (asc or desc)

### 2. Create Player
- **POST** `/players`
- Form data with image upload

### 3. Update Player
- **PATCH** `/players/:id`
- Form data with optional image upload

### 4. Delete Player
- **DELETE** `/players/:id`

### 5. Get Player Description
- **GET** `/players/:id/description`

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   Update the `.env` file with your MongoDB connection string.

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run the Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the API**
   - Base URL: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/documentation`

## Project Structure

```
src/
├── config/
│   └── database.js
├── models/
│   └── player.js
├── routes/
│   └── players.js
├── middleware/
│   ├── validation.js
│   └── errorHandler.js
├── utils/
│   └── imageProcessor.js
└── server.js
```

## Technologies Used

- **Node.js** - Runtime environment
- **Fastify** - Web framework
- **MongoDB** - Database
- **Joi** - Validation
- **Sharp** - Image processing
- **Multer** - File upload handling

## Validation Rules

- `name`: Required, non-empty string
- `team`: Required, non-empty string
- `country`: Required, non-empty string
- `runs`: Required, integer
- `role`: Required, one of: "Batsman", "Bowler", "All-rounder"
- `salary`: Required, positive number
- `image`: Binary file (optional for updates)

## Error Handling

The API includes comprehensive error handling for:
- Invalid input data
- Missing required fields
- Player not found
- Database connection issues
- File upload errors 