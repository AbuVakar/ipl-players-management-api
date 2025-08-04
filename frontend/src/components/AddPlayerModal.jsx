import React, { useState } from "react";
import api from "../config/api";

const AddPlayerModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    country: "",
    runs: "",
    salary: "",
    role: "Batsman",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== "") data.append(key, val);
      });

      await api.post('/players', data);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Add player error:", err);
      setError(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl">
        <h2 className="text-xl font-bold">➕ Add New Player</h2>

        {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="team"
          placeholder="Team (e.g. RCB)"
          className="w-full p-2 border rounded"
          value={formData.team}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          className="w-full p-2 border rounded"
          value={formData.country}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="runs"
          placeholder="Runs"
          className="w-full p-2 border rounded"
          value={formData.runs}
          onChange={handleChange}
          required
          min="0"
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="w-full p-2 border rounded"
          value={formData.salary}
          onChange={handleChange}
          required
          min="0"
        />

        <select
          name="role"
          className="w-full p-2 border rounded"
          value={formData.role}
          onChange={handleChange}
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

        <div className="flex justify-end gap-3">
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlayerModal;