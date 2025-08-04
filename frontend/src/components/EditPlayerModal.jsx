import React, { useState, useEffect } from "react";
import api from "../config/api";

const EditPlayerModal = ({ player, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    country: "",
    runs: 0,
    salary: 0,
    role: "Batsman",
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || "",
        team: player.team || "",
        country: player.country || "",
        runs: player.runs || 0,
        salary: player.salary || 0,
        role: player.role || "Batsman",
        image: null
      });
    }
  }, [player]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !player?._id) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== "") data.append(key, val);
      });

      const res = await api.patch(
        `/players/${player._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      onSave(res.data.player);
      onClose();
    } catch (err) {
      console.error("Update player error:", err);
      setError(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-xl font-bold mb-2">✏️ Edit Player</h2>

        {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="team"
          value={formData.team}
          onChange={handleChange}
          placeholder="Team"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="number"
          name="runs"
          value={formData.runs}
          onChange={handleChange}
          placeholder="Runs"
          className="w-full border px-3 py-2 rounded"
          required
          min="0"
        />

        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full border px-3 py-2 rounded"
          required
          min="0"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="All-Rounder">All-Rounder</option>
          <option value="Wicket-Keeper">Wicket-Keeper</option>
        </select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Player Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm"
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlayerModal;