// src/pages/Home.jsx
import React from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PlayerGrid from "../components/PlayerGrid"; // ✅ update this

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4">
        <SearchBar />
        <PlayerGrid /> {/* ✅ updated here */}
      </div>
    </div>
  );
};

export default Home;