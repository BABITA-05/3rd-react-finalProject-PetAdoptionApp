import React from "react";
import { useApp } from "../context/AppContext";
import "./ApplicationsPage.css";

export default function ApplicationsPage() {
  const { applications, pets } = useApp();

  // Helper: find the pet info for a given petId
  function getPet(petId) {
    return pets.find((p) => p.id === petId);
  }

  return (
    <div className="applications-page">

      <div className="page-header">
        <h2 className="page-title">My Applications</h2>
        <p className="page-subtitle">
          {applications.length === 0
            ? "No applications yet."
            : `${applications.length} application${applications.length !== 1 ? "s" : ""} submitted`}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>Nothing here yet</h3>
          <p>When you apply to adopt a pet, your applications will show up here.</p>
        </div>
      ) : (
        <div className="app-list">
          {applications.map((app) => {
            const pet = getPet(app.petId);
            return (
              <div key={app.id} className="app-card">

                {/* Pet image thumbnail */}
                <div className="app-card-image">
                  {pet ? (
                    <img src={pet.image} alt={pet.name} className="app-thumbnail" />
                  ) : (
                    <div className="app-thumbnail-fallback">🐾</div>
                  )}
                </div>

                {/* Pet & applicant info */}
                <div className="app-card-info">
                  <h4 className="app-pet-name">{pet ? pet.name : "Unknown Pet"}</h4>
                  <p className="app-pet-breed">{pet ? pet.breed : ""}</p>
                  <p className="app-detail">👤 {app.firstName} {app.lastName}</p>
                  <p className="app-detail">✉️ {app.email}</p>
                  <p className="app-detail">📅 Submitted: {app.submittedAt}</p>
                </div>

                {/* Status badge */}
                <div className={`app-status app-status--${app.status}`}>
                  {app.status === "pending"  && "⏳ Under Review"}
                  {app.status === "approved" && "✅ Approved"}
                  {app.status === "rejected" && "❌ Not Approved"}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
