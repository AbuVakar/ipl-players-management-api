const { v4: uuidv4 } = require('uuid');

class Player {
  constructor(db) {
    this.collection = db.collection('players');
  }

  // Create a new player
  async create(playerData) {
    const player = {
      id: uuidv4(),
      name: playerData.name,
      team: playerData.team,
      country: playerData.country,
      runs: parseInt(playerData.runs),
      role: playerData.role,
      salary: parseFloat(playerData.salary),
      image: playerData.image,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection.insertOne(player);
    return { ...player, _id: result.insertedId };
  }

  // Get all players with pagination, filtering, and sorting
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      team,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = options;

    // Build query
    const query = {};
    
    if (team) {
      query.team = { $regex: team, $options: 'i' };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [players, total] = await Promise.all([
      this.collection
        .find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .project({ _id: 0 })
        .toArray(),
      this.collection.countDocuments(query)
    ]);

    return {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      players
    };
  }

  // Get player by ID
  async getById(id) {
    return await this.collection.findOne({ id }, { projection: { _id: 0 } });
  }

  // Update player
  async update(id, updateData) {
    const updateFields = {};
    
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.team) updateFields.team = updateData.team;
    if (updateData.country) updateFields.country = updateData.country;
    if (updateData.runs) updateFields.runs = parseInt(updateData.runs);
    if (updateData.role) updateFields.role = updateData.role;
    if (updateData.salary) updateFields.salary = parseFloat(updateData.salary);
    if (updateData.image) updateFields.image = updateData.image;
    
    updateFields.updatedAt = new Date();

    const result = await this.collection.updateOne(
      { id },
      { $set: updateFields }
    );

    return result.modifiedCount > 0;
  }

  // Delete player
  async delete(id) {
    const result = await this.collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Get player description (detailed info)
  async getDescription(id) {
    const player = await this.collection.findOne(
      { id },
      { 
        projection: { 
          _id: 0,
          name: 1,
          team: 1,
          country: 1,
          runs: 1,
          image: 1,
          role: 1,
          salary: 1
        }
      }
    );
    
    return player;
  }

  // Check if player exists
  async exists(id) {
    const count = await this.collection.countDocuments({ id });
    return count > 0;
  }
}

module.exports = Player; 