import React, { useState } from "react";
import "./PetCard.css";

export default function PetCard({ pet, isFavorite, onToggleFavorite, onViewDetails, onDelete, isAdmin }) {

  // If the image fails to load, show a fallback emoji box
  const [imgFailed, setImgFailed] = useState(false);

  const isAdopted = pet.status === "adopted";

  return (
    <div className="pet-card" style={{ "--accent": pet.color }}>

      {/* --- Image Section --- */}
      <div className="card-image-wrap">
        {imgFailed ? (
          /* Fallback: show a colored box with a paw icon */
          <div className="card-image-fallback" style={{ background: pet.color + "22" }}>
            🐾
          </div>
        ) : (
          <img
            src={pet.image}
            alt={pet.name}
            className="card-image"
            onError={() => setImgFailed(true)}  /* called when image cannot load */
            loading="lazy"                        /* browser loads image only when visible */
          />
        )}

        {/* Heart button (top-right corner) */}
        <button
          className={`heart-btn ${isFavorite ? "heart-btn--active" : ""}`}
          onClick={() => onToggleFavorite(pet.id)}
          title="Save to favorites"
        >
          {isFavorite ? "🤍" : "❤️"}
        </button>

        {/* Status badge (Available / Adopted) */}
        <span className={`status-badge status-badge--${pet.status}`}>
          {pet.status === "adopted" ? "Adopted 🎉" : pet.status === "pending" ? "Pending ⏳" : "Available ✓"}
        </span>
      </div>

      {/* --- Info Section --- */}
      <div className="card-body">
        <h3 className="card-name">{pet.name}</h3>
        <p className="card-breed">{pet.breed}</p>

        {/* Small info row */}
        <div className="card-meta">
          <span>{pet.age} yr</span>
          <span>·</span>
          <span>{pet.gender}</span>
          <span>·</span>
          <span>{pet.size}</span>
        </div>

        {/* Personality tags */}
        <div className="card-tags">
          {pet.personality.map((trait) => (
            <span key={trait} className="card-tag">{trait}</span>
          ))}
        </div>

        <p className="card-location">📍 {pet.location}</p>
      </div>

      {/* --- Footer Buttons --- */}
      <div className="card-footer">
        <button
          className="btn btn-primary"
          onClick={() => onViewDetails(pet)}
          disabled={isAdopted}
        >
          {isAdopted ? "Adopted 🎉" : "Meet Me →"}
        </button>

        {/* Admin-only delete button */}
        {isAdmin && (
          <button className="btn btn-danger" onClick={() => onDelete(pet.id)}>
            🗑 Remove
          </button>
        )}
      </div>

    </div>
  );
}
