// backend/src/validation/player.schema.js
const Joi = require('joi');

// Common fields for POST & PATCH
const baseSchema = {
  name: Joi.string().min(2).max(50).required(),
  team: Joi.string().uppercase().min(2).max(5).required(),
  country: Joi.string().min(2).max(50).required(),
  runs: Joi.number().integer().min(0).required(),
  salary: Joi.number().min(0).required(),
  role: Joi.string()
    .valid('Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper')
    .required(),
};

// For creating a new player (image now optional)
const createPlayerSchema = Joi.object({
  ...baseSchema,
  image: Joi.any().optional(), // no longer required
});

// For updating (image optional)
const updatePlayerSchema = Joi.object({
  ...baseSchema,
  image: Joi.any().optional(),
});

module.exports = {
  createPlayerSchema,
  updatePlayerSchema,
};
