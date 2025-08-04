import React, { useCallback } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import API_BASE_URL from "../config/api";

const PlayerCard = ({ player = {}, onView, onEdit, onDelete }) => {
  const {
    name = "Unknown",
    team = "N/A",
    role = "N/A",
    country = "N/A",
    runs = 0,
    salary = 0,
    image = "",
    _id = "",
  } = player;

  const formattedSalary = 
    salary.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0
    }) || "₹0";

  const formattedRuns = runs.toLocaleString("en-IN") || "0";

  // Simplified ID display
  const getDisplayId = () => _id ? `ID: ${_id.substring(0, 8)}` : "ID: N/A";

  // Consolidated click handlers
  const handleView = useCallback((e) => {
    e.stopPropagation();
    onView && _id && onView(player);
  }, [onView, player, _id]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit && _id && onEdit(player);
  }, [onEdit, player, _id]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete && _id && onDelete(player);
  }, [onDelete, player, _id]);

  // Robust image URL handling
  const getImageUrl = () => {

    return image || `${API_BASE_URL}/players/${_id}/image`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={getImageUrl()}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
            }}
          />
          {team && (
            <span className="absolute -bottom-1 -right-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full border border-blue-200">
              {team}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-xs text-gray-500">{getDisplayId()}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-700">
        <span>
          <strong>Team:</strong>{" "}
          <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${
            team === "RCB" ? "bg-red-600" :
            team === "MI" ? "bg-blue-600" :
            team === "CSK" ? "bg-yellow-500 text-black" : "bg-gray-500"
          }`}>
            {team}
          </span>
        </span>
        <span><strong>Role:</strong> {role}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-700">
        <span><strong>Country:</strong> {country}</span>
        <span><strong>Runs:</strong> {formattedRuns}</span>
      </div>

      <div className="text-green-700 font-semibold text-sm">
        Salary: {formattedSalary}
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500 font-mono">{getDisplayId()}</span>
        <div className="flex gap-3">
          <button onClick={handleView} className="p-1 text-blue-600 hover:bg-blue-50 rounded-full">
            <Eye size={18} />
          </button>
          <button onClick={handleEdit} className="p-1 text-orange-500 hover:bg-orange-50 rounded-full">
            <Pencil size={18} />
          </button>
          <button onClick={handleDelete} className="p-1 text-red-600 hover:bg-red-50 rounded-full">
            <Trash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;