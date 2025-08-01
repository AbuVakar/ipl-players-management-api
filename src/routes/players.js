const { NotFoundError } = require('../middleware/errorHandler');
const imageProcessor = require('../utils/imageProcessor');

// Players routes
async function playerRoutes(fastify, options) {
  const { Player } = fastify;
  const { 
    validateCreatePlayer, 
    validateUpdatePlayer, 
    validateQueryParams, 
    validatePlayerId 
  } = fastify.validation;

  // GET /players - List all players with pagination, filtering, and sorting
  fastify.get('/players', {
    preHandler: validateQueryParams,
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          team: { type: 'string', minLength: 1, maxLength: 50 },
          search: { type: 'string', minLength: 1, maxLength: 100 },
          sort: { 
            type: 'string', 
            enum: ['name', 'team', 'runs', 'salary', 'createdAt']
          },
          order: { 
            type: 'string', 
            enum: ['asc', 'desc']
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            players: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  image: { type: 'string' },
                  role: { type: 'string' },
                  team: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { page, limit, team, search, sort, order } = request.query;
      
      const result = await Player.getAll({
        page,
        limit,
        team,
        search,
        sort,
        order
      });

      return reply.send(result);
    } catch (error) {
      throw error;
    }
  });

  // POST /players - Create a new player
  fastify.post('/players', {
    preHandler: [validateCreatePlayer],
    schema: {
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        required: ['name', 'team', 'country', 'runs', 'role', 'salary'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          team: { type: 'string', minLength: 1, maxLength: 50 },
          country: { type: 'string', minLength: 1, maxLength: 50 },
          runs: { type: 'number', minimum: 0 },
          role: { type: 'string', enum: ['Batsman', 'Bowler', 'All-rounder'] },
          salary: { type: 'number', minimum: 0 },
          image: { type: 'string' } // Will be processed as file
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const data = request.body;
      let imageUrl = null;

      // Handle image upload if present
      if (request.file) {
        imageProcessor.validateImage(request.file);
        imageUrl = await imageProcessor.processImage(request.file);
      }

      // Create player data
      const playerData = {
        ...data,
        image: imageUrl
      };

      await Player.create(playerData);

      return reply.code(201).send({
        message: 'Player created successfully'
      });
    } catch (error) {
      throw error;
    }
  });

  // PATCH /players/:id - Update a player
  fastify.patch('/players/:id', {
    preHandler: [validatePlayerId, validateUpdatePlayer],
    schema: {
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          team: { type: 'string', minLength: 1, maxLength: 50 },
          country: { type: 'string', minLength: 1, maxLength: 50 },
          runs: { type: 'number', minimum: 0 },
          role: { type: 'string', enum: ['Batsman', 'Bowler', 'All-rounder'] },
          salary: { type: 'number', minimum: 0 },
          image: { type: 'string' } // Will be processed as file
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const data = request.body;

      // Check if player exists
      const existingPlayer = await Player.getById(id);
      if (!existingPlayer) {
        throw new NotFoundError('Player not found');
      }

      let imageUrl = data.image;

      // Handle image upload if present
      if (request.file) {
        imageProcessor.validateImage(request.file);
        imageUrl = await imageProcessor.processImage(request.file);
        
        // Delete old image if exists
        if (existingPlayer.image) {
          await imageProcessor.deleteImage(existingPlayer.image);
        }
      }

      // Update player data
      const updateData = {
        ...data,
        image: imageUrl
      };

      const updated = await Player.update(id, updateData);

      if (!updated) {
        throw new Error('Failed to update player');
      }

      return reply.send({
        message: 'Player updated successfully'
      });
    } catch (error) {
      throw error;
    }
  });

  // DELETE /players/:id - Delete a player
  fastify.delete('/players/:id', {
    preHandler: validatePlayerId,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;

      // Check if player exists
      const existingPlayer = await Player.getById(id);
      if (!existingPlayer) {
        throw new NotFoundError('Player not found');
      }

      // Delete player
      const deleted = await Player.delete(id);

      if (!deleted) {
        throw new Error('Failed to delete player');
      }

      // Delete associated image
      if (existingPlayer.image) {
        await imageProcessor.deleteImage(existingPlayer.image);
      }

      return reply.send({
        message: 'Player deleted successfully'
      });
    } catch (error) {
      throw error;
    }
  });

  // GET /players/:id/description - Get detailed player description
  fastify.get('/players/:id/description', {
    preHandler: validatePlayerId,
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            team: { type: 'string' },
            country: { type: 'string' },
            runs: { type: 'number' },
            image: { type: 'string' },
            role: { type: 'string' },
            salary: { type: 'number' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params;

      const player = await Player.getDescription(id);

      if (!player) {
        throw new NotFoundError('Player not found');
      }

      return reply.send(player);
    } catch (error) {
      throw error;
    }
  });
}

module.exports = playerRoutes; 