
import multer from 'multer';
import Player from "../models/player.model.js";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
// GET /api/players
export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find(); // DB se saare players fetch karo
    res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Failed to get players" });
  }
};

// POST /api/players
// Add to your createPlayer function
export const createPlayer = async (req, res) => {
  try {
    const playerData = {
      ...req.body,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    };
    
    const newPlayer = new Player(playerData);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ message: "Failed to create player" });
  }
};

// GET /api/players/:id
export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ message: "Failed to get player" });
  }
};

// PUT /api/players/:id
export const updatePlayer = async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(updatedPlayer);
  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ message: "Failed to update player" });
  }
};

// DELETE /api/players/:id
export const deletePlayer = async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({ message: "Failed to delete player" });
  }
};

