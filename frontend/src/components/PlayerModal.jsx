import React from "react";
import { X } from "lucide-react";

const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;

  const {
    name = "Unknown",
    team = "Unknown",
    country = "Unknown",
    role = "Unknown",
    runs = 0,
    salary = 0,
    image,
    _id = "",
  } = player;

  const formattedSalary = salary.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0
  }) || "N/A";

  const formattedRuns = runs.toLocaleString("en-IN") || "0";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-3">
          <img
            src={image || '/default-player.png'}
            alt={name}
            className="w-24 h-24 rounded-full border object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-player.png';
            }}
          />
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-500">ID: {_id?.slice(0, 8)}...</p>

          <div className="grid grid-cols-2 gap-3 text-sm w-full mt-4">
            <div>
              <strong>Team:</strong>{" "}
              <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${
                team === "RCB" ? "bg-red-600" :
                team === "MI" ? "bg-blue-600" :
                team === "CSK" ? "bg-yellow-400 text-black" : "bg-gray-500"
              }`}>
                {team}
              </span>
            </div>
            <div><strong>Role:</strong> {role}</div>
            <div><strong>Country:</strong> {country}</div>
            <div><strong>Runs:</strong> {formattedRuns}</div>
            <div className="col-span-2 text-green-700 font-semibold">
              Salary: {formattedSalary}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;