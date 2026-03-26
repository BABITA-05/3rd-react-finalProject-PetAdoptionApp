import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import "./PetModal.css";

export default function PetModal({ pet, onClose }) {
  const { toggleFavorite, favorites, submitApplication, applications } = useApp();

  const isFavorite = favorites.includes(pet.id);
  const isAdopted = pet.status === "adopted";

  // Check if the user already applied for this pet
  const existingApplication = applications.find((a) => a.petId === pet.id);

  // Controls which "screen" is shown inside the modal
  const [screen, setScreen] = useState("details"); // "details" | "form" | "success"

  // Form input values
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
  });

  // Lock page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Update a single field in the form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submit the adoption form
  function handleSubmit(e) {
    e.preventDefault();
    submitApplication(pet.id, form);
    setScreen("success");
  }

  return (
    /* Clicking the dark overlay closes the modal */
    <div className="modal-overlay" onClick={onClose}>

      {/* Clicking inside the modal does NOT close it */}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Pet image */}
        <div className="modal-image-wrap">
          <img src={pet.image} alt={pet.name} className="modal-image" />
          <button
            className={`heart-btn ${isFavorite ? "heart-btn--active" : ""}`}
            onClick={() => toggleFavorite(pet.id)}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <div className="modal-content">

          {/* ── Screen 1: Pet Details ── */}
          {screen === "details" && (
            <>
              <h2 className="modal-pet-name" style={{ borderBottom: `3px solid ${pet.color}` }}>
                {pet.name}
              </h2>
              <p className="modal-breed">{pet.breed} · {pet.species}</p>

              {/* Info grid */}
              <div className="modal-info-grid">
                <InfoBox label="Age" value={`${pet.age} yr`} />
                <InfoBox label="Gender" value={pet.gender} />
                <InfoBox label="Size" value={pet.size} />
                <InfoBox label="Vaccinated" value={pet.vaccinated ? "Yes ✓" : "No"} />
                <InfoBox label="Neutered" value={pet.neutered ? "Yes ✓" : "No"} />
                <InfoBox label="Location" value={pet.location} />
              </div>

              <p className="modal-description">{pet.description}</p>

              {/* Personality */}
              <div className="modal-traits">
                {pet.personality.map((trait) => (
                  <span key={trait} className="card-tag"
                    style={{ "--accent": pet.color }}>
                    {trait}
                  </span>
                ))}
              </div>

              {/* Action area */}
              {isAdopted ? (
                <div className="modal-notice modal-notice--adopted">
                  🎉 {pet.name} has already found a forever home!
                </div>
              ) : existingApplication ? (
                <div className="modal-notice modal-notice--applied">
                  ✅ You have already applied to adopt {pet.name}. We will contact you soon!
                </div>
              ) : (
                <button className="btn btn-primary btn-large" onClick={() => setScreen("form")}>
                  🐾 Apply to Adopt {pet.name}
                </button>
              )}
            </>
          )}

          {/* ── Screen 2: Adoption Form ── */}
          {screen === "form" && (
            <>
              <h2 className="modal-pet-name">Adoption Form</h2>
              <p className="modal-breed">Applying for: <strong>{pet.name}</strong></p>

              <form className="adopt-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <FormInput label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                  <FormInput label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
                </div>

                <div className="form-row">
                  <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  <FormInput label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                </div>

                <div className="form-field">
                  <label className="form-label">Why do you want to adopt {pet.name}? *</label>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    rows={4}
                    required
                    minLength={20}
                    placeholder="Tell us a little about yourself and your home..."
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setScreen("details")}>
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Application 🐾
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── Screen 3: Success ── */}
          {screen === "success" && (
            <div className="modal-success">
              <div className="success-icon">🎉</div>
              <h3>Application Submitted!</h3>
              <p>We will reach out to <strong>{form.email}</strong> soon.</p>
              <button className="btn btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// A tiny helper component for the info grid boxes
function InfoBox({ label, value }) {
  return (
    <div className="info-box">
      <span className="info-box-value">{value}</span>
      <span className="info-box-label">{label}</span>
    </div>
  );
}

// A tiny helper for form inputs
function FormInput({ label, name, type = "text", value, onChange, required }) {
  return (
    <div className="form-field">
      <label className="form-label">{label} {required && <span className="required">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="form-input"
        required={required}
      />
    </div>
  );
}
