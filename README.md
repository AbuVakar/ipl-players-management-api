# IPL Player Management API

A full-stack application for managing IPL (Indian Premier League) players with CRUD operations and image uploads.

## 🚀 Features

- **Player Management**: Add, view, edit, and delete player information
- **Search & Filter**: Search players by name, team, or role
- **Sorting**: Sort players by various fields (name, runs, salary, etc.)
- **Pagination**: Browse through players with pagination
- **Image Upload**: Upload and display player images
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios for API calls
- React Icons

### Backend
- Node.js
- Fastify
- MongoDB 
- Multer for file uploads

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ipl-player-management.git
   cd ipl-player-management
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📝 API Endpoints

### Players
- `GET /api/players` - Get all players (with pagination, search, and filters)
- `GET /api/players/:id` - Get a single player by ID
- `POST /api/players` - Create a new player
- `PATCH /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player
- `GET /api/players/:id/image` - Get player image

## 🌟 Project Structure

```
ipl-player-management/
├── backend/               # Backend server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   └── index.js      # Server entry point
│   └── package.json
│
└── frontend/             # Frontend React app
    ├── public/           # Static files
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── App.jsx       # Main App component
    │   └── main.jsx      # Entry point
    └── package.json
```

## 📝 Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ipl
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [Fastify](https://www.fastify.io/) for the fast backend framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
