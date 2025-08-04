// PlayerGrid.jsx (Updated with safety checks and error handling)
import React, { useState, useEffect, useCallback } from "react";
import PlayerCard from "./PlayerCard";
import PlayerModal from "./PlayerModal";
import EditPlayerModal from "./EditPlayerModal";
import AddPlayerModal from "./AddPlayerModal";
import api from "../config/api";

const PlayerGrid = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [team, setTeam] = useState("");
  const [teamOptions, setTeamOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { search, sortBy, order, team, page, limit };
      const res = await api.get('/players', { params });

      const data = res?.data;
      if (!data || !Array.isArray(data.players)) {
        throw new Error("Invalid response format from server");
      }

      const mappedPlayers = data.players.map(p => ({
        ...p,
        _id: p._id || p.id,
        id: p._id || p.id,
      }));

      setPlayers(mappedPlayers);
      setTotal(data.total || 0);

      const teams = [...new Set(mappedPlayers.map(p => p.team).filter(t => t))];
      setTeamOptions(teams);
    } catch (err) {
      console.error("Fetch players error:", err);
      setError(err.message || "Error fetching players");
      setPlayers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, order, team, page, limit]);

  useEffect(() => { fetchPlayers(); }, [fetchPlayers]);

  const handleView = useCallback((player) => {
    if (!player) return;
    setSelectedPlayer(player);
    setIsViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((player) => {
    if (!player) return;
    setSelectedPlayer(player);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setTimeout(() => setSelectedPlayer(null), 300);
  }, []);

  const handleDelete = useCallback(async (player) => {
    if (!player?._id || !window.confirm(`Are you sure you want to delete ${player.name}?`)) return;
    try {
      await api.delete(`/players/${player._id}`);
      handleCloseModal();
      fetchPlayers();
    } catch (err) {
      console.error("Delete player error:", err);
      alert(`Failed to delete player: ${err.message || err}`);
    }
  }, [fetchPlayers, handleCloseModal]);

  const handleSavePlayer = useCallback((updatedPlayer) => {
    if (!updatedPlayer?._id) return;
    setPlayers(prev => prev.map(p => p._id === updatedPlayer._id ? updatedPlayer : p));
    setSelectedPlayer(prev => prev?._id === updatedPlayer._id ? updatedPlayer : prev);
    setIsEditModalOpen(false);
  }, []);

  const handleAddPlayer = useCallback(() => setIsAddModalOpen(true), []);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mt-6 mb-4">
        <h2 className="text-xl font-bold">🏏 Player List</h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
            <option value="name">Name</option>
            <option value="runs">Runs</option>
            <option value="salary">Salary</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)} className="p-2 border rounded">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <select value={team} onChange={(e) => setTeam(e.target.value)} className="p-2 border rounded">
            <option value="">All Teams</option>
            {teamOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button
            onClick={handleAddPlayer}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Player
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-4">Loading players...</div>}
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard
            key={player?._id || player.id}
            player={player}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {players.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No players found. Try adjusting your search filters.
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >⬅️ Previous</button>
        <span>Page <b>{page}</b> of <b>{totalPages || 1}</b></span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >Next ➡️</button>
      </div>

      {isViewModalOpen && (
        <PlayerModal player={selectedPlayer} onClose={handleCloseModal} />
      )}
      {isEditModalOpen && (
        <EditPlayerModal
          player={selectedPlayer}
          onClose={handleCloseModal}
          onSave={handleSavePlayer}
        />
      )}
      {isAddModalOpen && (
        <AddPlayerModal onClose={handleCloseModal} onSuccess={fetchPlayers} />
      )}
    </>
  );
};

export default PlayerGrid;
