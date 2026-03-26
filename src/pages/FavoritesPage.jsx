import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import PetCard from "../components/PetCard";
import PetModal from "../components/PetModal";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const { pets, favorites, toggleFavorite, deletePet } = useApp();

  const [selectedPet, setSelectedPet] = useState(null);

  // Get only the pets that are in the favorites list
  const favoritePets = pets.filter((pet) => favorites.includes(pet.id));

  return (
    <div className="favorites-page">

      <div className="page-header">
        <h2 className="page-title">❤️ My Favorites</h2>
        <p className="page-subtitle">
          {favoritePets.length === 0
            ? "You haven't saved any pets yet."
            : `${favoritePets.length} pet${favoritePets.length !== 1 ? "s" : ""} saved`}
        </p>
      </div>

      {favoritePets.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🤍</span>
          <h3>No favorites yet</h3>
          <p>Browse pets and tap the heart ❤️ to save them here.</p>
        </div>
      ) : (
        <div className="pet-grid">
          {favoritePets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              onViewDetails={setSelectedPet}
              onDelete={deletePet}
              isAdmin={false}
            />
          ))}
        </div>
      )}

      {selectedPet && (
        <PetModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
      )}
    </div>
  );
}
