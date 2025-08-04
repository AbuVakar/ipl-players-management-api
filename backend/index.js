// server.js
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import playerRoutes from './src/routes/player.routes.js';
import connectDB from './src/config/db.js'; // MongoDB connection function import karo

const fastify = Fastify({
  logger: true,
});

// Register plugins
await fastify.register(cors, {
  origin: '*', // production me origin update karo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // PATCH add kar diya

});
await fastify.register(multipart, {
  attachFieldsToBody: true, // multer jaisa multipart form handling
});

// Register routes
await fastify.register(playerRoutes, { prefix: '/api/players' });

const start = async () => {
  try {
    await connectDB(); // MongoDB connect karo before server start
    await fastify.listen({ port: 5000 });
    console.log('🚀 Server listening on http://localhost:5000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
