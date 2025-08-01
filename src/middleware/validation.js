const Joi = require('joi');

// Validation schemas
const playerCreateSchema = Joi.object({
  name: Joi.string().required().min(1).max(100).messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name cannot exceed 100 characters'
  }),
  team: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Team is required',
    'string.min': 'Team must be at least 1 character long',
    'string.max': 'Team cannot exceed 50 characters'
  }),
  country: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'Country is required',
    'string.min': 'Country must be at least 1 character long',
    'string.max': 'Country cannot exceed 50 characters'
  }),
  runs: Joi.number().integer().min(0).required().messages({
    'number.base': 'Runs must be a number',
    'number.integer': 'Runs must be an integer',
    'number.min': 'Runs cannot be negative',
    'any.required': 'Runs is required'
  }),
  role: Joi.string().valid('Batsman', 'Bowler', 'All-rounder').required().messages({
    'any.only': 'Role must be one of: Batsman, Bowler, All-rounder',
    'any.required': 'Role is required'
  }),
  salary: Joi.number().positive().required().messages({
    'number.base': 'Salary must be a number',
    'number.positive': 'Salary must be a positive number',
    'any.required': 'Salary is required'
  })
});

const playerUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 1 character long',
    'string.max': 'Name cannot exceed 100 characters'
  }),
  team: Joi.string().min(1).max(50).optional().messages({
    'string.empty': 'Team cannot be empty',
    'string.min': 'Team must be at least 1 character long',
    'string.max': 'Team cannot exceed 50 characters'
  }),
  country: Joi.string().min(1).max(50).optional().messages({
    'string.empty': 'Country cannot be empty',
    'string.min': 'Country must be at least 1 character long',
    'string.max': 'Country cannot exceed 50 characters'
  }),
  runs: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Runs must be a number',
    'number.integer': 'Runs must be an integer',
    'number.min': 'Runs cannot be negative'
  }),
  role: Joi.string().valid('Batsman', 'Bowler', 'All-rounder').optional().messages({
    'any.only': 'Role must be one of: Batsman, Bowler, All-rounder'
  }),
  salary: Joi.number().positive().optional().messages({
    'number.base': 'Salary must be a number',
    'number.positive': 'Salary must be a positive number'
  })
});

const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  }),
  team: Joi.string().min(1).max(50).optional().messages({
    'string.min': 'Team filter must be at least 1 character long',
    'string.max': 'Team filter cannot exceed 50 characters'
  }),
  search: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'Search term must be at least 1 character long',
    'string.max': 'Search term cannot exceed 100 characters'
  }),
  sort: Joi.string().valid('name', 'team', 'runs', 'salary', 'createdAt').optional().messages({
    'any.only': 'Sort must be one of: name, team, runs, salary, createdAt'
  }),
  order: Joi.string().valid('asc', 'desc').optional().messages({
    'any.only': 'Order must be either asc or desc'
  })
});

const playerIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Player ID is required'
  })
});

// Validation middleware functions
const validateCreatePlayer = async (request, reply) => {
  try {
    const data = request.body;
    await playerCreateSchema.validateAsync(data);
  } catch (error) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.details[0].message
    });
  }
};

const validateUpdatePlayer = async (request, reply) => {
  try {
    const data = request.body;
    await playerUpdateSchema.validateAsync(data);
  } catch (error) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.details[0].message
    });
  }
};

const validateQueryParams = async (request, reply) => {
  try {
    const query = request.query;
    const validatedQuery = await queryParamsSchema.validateAsync(query);
    request.query = validatedQuery;
  } catch (error) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.details[0].message
    });
  }
};

const validatePlayerId = async (request, reply) => {
  try {
    const params = request.params;
    await playerIdSchema.validateAsync(params);
  } catch (error) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.details[0].message
    });
  }
};

module.exports = {
  validateCreatePlayer,
  validateUpdatePlayer,
  validateQueryParams,
  validatePlayerId
}; 