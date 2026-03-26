import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import PetCard from "../components/PetCard";
import PetModal from "../components/PetModal";
import "./HomePage.css";

export default function HomePage() {
  const { pets, favorites, toggleFavorite, deletePet } = useApp();

  // The pet the user clicked on (to show in the modal)
  const [selectedPet, setSelectedPet] = useState(null);

  // Search and filter state
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // --- Filter logic ---
  // We filter pets based on search text + dropdowns
  const filteredPets = pets.filter((pet) => {
    const query = search.toLowerCase();

    // Check if the search text matches name or breed
    const matchesSearch =
      query === "" ||
      pet.name.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query);

    const matchesSpecies = filterSpecies === "all" || pet.species === filterSpecies;
    const matchesStatus  = filterStatus  === "all" || pet.status  === filterStatus;

    return matchesSearch && matchesSpecies && matchesStatus;
  });

  const availableCount = pets.filter((p) => p.status === "available").length;

  return (
    <div className="home-page">

      {/* ── Hero Banner ── */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">🐾 Nepal's Pet Adoption Platform</p>
          <h1 className="hero-title">Every pet deserves a <em>forever home.</em></h1>
          <p className="hero-subtitle">
            Browse {availableCount} loving animals waiting for someone just like you.
          </p>
        </div>
      </section>

      {/* ── Search & Filters ── */}
      <section className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="🔍  Search by name or breed..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-dropdowns">
          <select value={filterSpecies} onChange={(e) => setFilterSpecies(e.target.value)} className="filter-select">
            <option value="all">All Species</option>
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
            <option value="rabbit">Rabbits</option>
            <option value="bird">Birds</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
          </select>

          {/* Show a reset button only when filters are active */}
          {(search || filterSpecies !== "all" || filterStatus !== "all") && (
            <button
              className="reset-btn"
              onClick={() => { setSearch(""); setFilterSpecies("all"); setFilterStatus("all"); }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        <p className="result-count">{filteredPets.length} pet{filteredPets.length !== 1 ? "s" : ""} found</p>
      </section>

      {/* ── Pet Grid ── */}
      {filteredPets.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No pets found</h3>
          <p>Try a different search or clear your filters.</p>
        </div>
      ) : (
        <div className="pet-grid">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              isFavorite={favorites.includes(pet.id)}
              onToggleFavorite={toggleFavorite}
              onViewDetails={setSelectedPet}   /* opens the modal */
              onDelete={deletePet}
              isAdmin={false}
            />
          ))}
        </div>
      )}

      {/* ── Modal (only shown when a pet is selected) ── */}
      {selectedPet && (
        <PetModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
}
