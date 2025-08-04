import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm, teamFilter, setTeamFilter, sortBy, setSortBy }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between bg-white p-4 border rounded-md shadow-sm">
      <input
        type="text"
        placeholder="Search by player name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-4 py-2 rounded-md w-full md:w-1/3 focus:outline-none focus:ring focus:border-blue-300"
      />

      <select
        value={teamFilter}
        onChange={(e) => setTeamFilter(e.target.value)}
        className="border px-4 py-2 rounded-md w-full md:w-1/4 focus:outline-none"
      >
        <option value="">All Teams</option>
        <option value="RCB">RCB</option>
        <option value="MI">MI</option>
        <option value="CSK">CSK</option>
        <option value="KKR">KKR</option>
        <option value="DC">DC</option>
        <option value="RR">RR</option>
        <option value="LSG">LSG</option>
        <option value="GT">GT</option>
        <option value="PBKS">PBKS</option>
        <option value="SRH">SRH</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border px-4 py-2 rounded-md w-full md:w-1/4 focus:outline-none"
      >
        <option value="name">Name</option>
        <option value="runs">Runs</option>
        <option value="salary">Salary</option>
      </select>
    </div>
  );
};

export default SearchBar;