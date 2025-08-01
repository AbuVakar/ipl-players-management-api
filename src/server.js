const fastify = require('fastify');
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const multipart = require('@fastify/multipart');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import local modules
const database = require('./config/database');
const Player = require('./models/player');
const playerRoutes = require('./routes/players');
const { errorHandler } = require('./middleware/errorHandler');
const validation = require('./middleware/validation');
const imageProcessor = require('./utils/imageProcessor');

// Create Fastify instance
const server = fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'error'
  }
});

// Register plugins
async function registerPlugins() {
  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: false
  });

  // CORS
  await server.register(cors, {
    origin: true,
    credentials: true
  });

  // Multipart support for file uploads
  await server.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1
    }
  });

  // Serve static files (uploaded images)
  server.register(require('@fastify/static'), {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/'
  });
}

// Register decorators
function registerDecorators() {
  // Add database and models to fastify instance
  server.decorate('db', database.getDb());
  server.decorate('Player', new Player(database.getDb()));
  
  // Add validation middleware
  server.decorate('validation', validation);
  
  // Add image processor
  server.decorate('imageProcessor', imageProcessor);
}

// Register routes
async function registerRoutes() {
  await server.register(playerRoutes, { prefix: '/api' });
}

// Add hooks
function addHooks() {
  // Parse multipart data
  server.addHook('preHandler', async (request, reply) => {
    if (request.isMultipart()) {
      const data = await request.file();
      if (data) {
        request.file = data;
      }
    }
  });
}

// Error handler
server.setErrorHandler(errorHandler);

// Health check endpoint
server.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Root endpoint - serve frontend
server.get('/', async (request, reply) => {
  try {
    const htmlPath = path.join(__dirname, '../public/index.html');
    console.log('HTML Path:', htmlPath);
    console.log('File exists:', fs.existsSync(htmlPath));
    
    if (!fs.existsSync(htmlPath)) {
      return reply.code(404).send({ error: 'Frontend file not found', path: htmlPath });
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    reply.type('text/html');
    return reply.send(htmlContent);
  } catch (error) {
    console.error('Error serving frontend:', error);
    reply.code(500).send({ error: 'Frontend error', message: error.message });
  }
});

// API info endpoint
server.get('/api', async (request, reply) => {
  return {
    message: 'IPL Players Management API',
    version: '1.0.0',
    endpoints: {
      'GET /api/players': 'List all players with pagination and filtering',
      'POST /api/players': 'Create a new player',
      'PATCH /api/players/:id': 'Update a player',
      'DELETE /api/players/:id': 'Delete a player',
      'GET /api/players/:id/description': 'Get detailed player description'
    },
    documentation: '/documentation'
  };
});

// Start server
async function start() {
  try {
    // Connect to database
    await database.connect();
    
    // Register plugins
    await registerPlugins();
    
    // Register decorators
    registerDecorators();
    
    // Register routes
    await registerRoutes();
    
    // Add hooks
    addHooks();
    
    // Start server
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`🌐 Frontend available at http://localhost:${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/documentation`);
    
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await server.close();
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await server.close();
  await database.disconnect();
  process.exit(0);
});

// Start the server
start(); 