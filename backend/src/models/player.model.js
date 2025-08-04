// backend/src/models/player.model.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const playerSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  team: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  runs: {
    type: Number,
    required: true,
    min: 0,
  },
  salary: {
    type: Number,
    required: true,
    min: 0,
  },
  role: {
    type: String,
    required: true,
    enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'],
  },
  image: {
    data: Buffer, // Store binary image data
    contentType: String // Store MIME type of the image
  },
}, {
  timestamps: true,
});

export default mongoose.model('Player', playerSchema);