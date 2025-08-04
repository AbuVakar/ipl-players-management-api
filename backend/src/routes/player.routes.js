// src/routes/player.routes.js
import Player from '../models/player.model.js';

export default async function playerRoutes(fastify, opts) {
  
  // GET /api/players with search, sort, pagination, filter by team
  fastify.get('/', async (request, reply) => {
    const {
      search = '',
      sortBy = 'name',
      order = 'asc',
      team = '',
      page = 1,
      limit = 6,
    } = request.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (team) filter.team = team.toUpperCase();

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    try {
      const players = await Player.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

      const total = await Player.countDocuments(filter);

      return { players, total };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Failed to get players' });
    }
  });

  // POST /api/players - create new player with optional image upload
fastify.post('/', async (request, reply) => {
  try {
    const { body, files } = request;

    // Convert all multipart fields from object {value: 'something'} to just the string
    const playerData = {};
    for (const key in body) {
      const field = body[key];
      if (field && typeof field === 'object' && 'value' in field) {
        playerData[key] = field.value;
      } else {
        playerData[key] = field;
      }
    }

    // Convert runs and salary to numbers
    playerData.runs = Number(playerData.runs);
    playerData.salary = Number(playerData.salary);

    // Convert team to uppercase if exists
    if (playerData.team) {
      playerData.team = playerData.team.toUpperCase();
    }

    // Handle image file if present
    if (files && files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
      const chunks = [];
      for await (const chunk of imageFile.file) {
        chunks.push(chunk);
      }
      playerData.image = {
        data: Buffer.concat(chunks),
        contentType: imageFile.mimetype,
      };
    }

    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();

    reply.code(201).send(savedPlayer);
  } catch (error) {
    console.error('Error creating player:', error);
    reply.code(500).send({ message: 'Failed to create player', error: error.message });
  }
});


  // GET /api/players/:id - get player by id
  fastify.get('/:id', async (request, reply) => {
    try {
      const player = await Player.findById(request.params.id);
      if (!player) {
        return reply.status(404).send({ message: 'Player not found' });
      }
      return player;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Failed to get player' });
    }
  });
fastify.patch('/:id', async (request, reply) => {
  const { id } = request.params;

  try {
    // Extract only the values from multipart fields
    const rawData = request.body;
    const data = {};

    for (const field in rawData) {
      if (rawData[field]?.value !== undefined) {
        data[field] = rawData[field].value;
      }
    }

    console.log('Parsed update data:', data);

    const updatedPlayer = await Player.findByIdAndUpdate(id, data, { new: true });

    if (!updatedPlayer) {
      return reply.status(404).send({ message: 'Player not found' });
    }

    return updatedPlayer;
  } catch (err) {
    fastify.log.error('Error updating player:', err);
    return reply.status(500).send({ message: 'Failed to update player', error: err.message });
  }
});


  // PUT /api/players/:id - update player by id with optional image upload
  fastify.put('/:id', async (request, reply) => {
    try {
      const { body, files } = request;
      let updateData = { ...body };

      const imageFile = files?.image;
      if (imageFile) {
        const file = Array.isArray(imageFile) ? imageFile[0] : imageFile;
        const chunks = [];
        for await (const chunk of file.file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        updateData.image = {
          data: buffer,
          contentType: file.mimetype,
        };
      }

      const updatedPlayer = await Player.findByIdAndUpdate(request.params.id, updateData, { new: true });
      if (!updatedPlayer) {
        return reply.status(404).send({ message: 'Player not found' });
      }
      reply.send(updatedPlayer);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Failed to update player' });
    }
  });

  // DELETE /api/players/:id - delete player by id
  fastify.delete('/:id', async (request, reply) => {
    try {
      const deletedPlayer = await Player.findByIdAndDelete(request.params.id);
      if (!deletedPlayer) {
        return reply.status(404).send({ message: 'Player not found' });
      }
      reply.send({ message: 'Player deleted successfully' });
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Failed to delete player' });
    }
  });

  // GET /api/players/:id/image - get player image
  fastify.get('/:id/image', async (request, reply) => {
    try {
      const player = await Player.findById(request.params.id);
      if (!player || !player.image) {
        return reply.status(404).send({ message: 'Image not found' });
      }
      reply.header('Content-Type', player.image.contentType);
      reply.send(player.image.data);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ message: 'Error fetching image' });
    }
  });
}
