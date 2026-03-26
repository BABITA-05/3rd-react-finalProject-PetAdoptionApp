import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import PetCard from "../components/PetCard";
import "./AdminPage.css";

// Default values for the "Add Pet" form
const EMPTY_FORM = {
  name: "",
  breed: "",
  species: "dog",
  age: "",
  gender: "male",
  size: "medium",
  location: "",
  description: "",
  personality: "",    // user types "playful, curious" — we split it into an array on submit
  vaccinated: false,
  neutered: false,
  color: "#e86b3a",
  image: "",          // URL to an image
};

export default function AdminPage() {
  const { pets, addPet, deletePet, updatePetStatus } = useApp();

  // Show/hide the "Add Pet" form
  const [showForm, setShowForm] = useState(false);

  // Form values
  const [form, setForm] = useState(EMPTY_FORM);

  // Success message after adding
  const [successMsg, setSuccessMsg] = useState("");

  // Filter the admin list by status
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredPets = filterStatus === "all"
    ? pets
    : pets.filter((p) => p.status === filterStatus);

  // Update a single form field
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  // Submit the add-pet form
  function handleSubmit(e) {
    e.preventDefault();

    // Build the pet object
    const newPet = {
      ...form,
      age: parseFloat(form.age) || 0,
      // Split "playful, curious" into ["playful", "curious"]
      personality: form.personality.split(",").map((s) => s.trim()).filter(Boolean),
      // Use a placeholder image if none provided
      image: form.image || `https://placedog.net/400/300?id=${Date.now()}`,
    };

    addPet(newPet);
    setForm(EMPTY_FORM);     // reset the form
    setShowForm(false);
    setSuccessMsg(`✅ ${newPet.name} added to the shelter!`);
    setTimeout(() => setSuccessMsg(""), 3000);  // clear message after 3s
  }

  function handleDelete(petId) {
    const pet = pets.find((p) => p.id === petId);
    if (window.confirm(`Remove ${pet?.name} from the shelter?`)) {
      deletePet(petId);
    }
  }

  // Stats at the top
  const stats = [
    { label: "Total",     count: pets.filter((p) => p.status !== "deleted").length, color: "#6366F1" },
    { label: "Available", count: pets.filter((p) => p.status === "available").length, color: "#10B981" },
    { label: "Pending",   count: pets.filter((p) => p.status === "pending").length,   color: "#F59E0B" },
    { label: "Adopted",   count: pets.filter((p) => p.status === "adopted").length,   color: "#9CA3AF" },
  ];

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="page-header admin-header">
        <div>
          <h2 className="page-title"> Admin Dashboard</h2>
          <p className="page-subtitle">Add, remove, or update pet listings</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "➕ Add Pet"}
        </button>
      </div>

      {/* Stats row */}
      <div className="admin-stats">
        {stats.map((s) => (
          <div key={s.label} className="stat-box" style={{ "--stat-color": s.color }}>
            <span className="stat-number">{s.count}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Success message */}
      {successMsg && <div className="admin-success">{successMsg}</div>}

      {/* ── Add Pet Form ── */}
      {showForm && (
        <div className="admin-form-box">
          <h3 className="admin-form-title">➕ Add a New Pet</h3>

          <form className="admin-form" onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="form-row">
              <AdminField label="Name *"  name="name"  value={form.name}  onChange={handleChange} required />
              <AdminField label="Breed *" name="breed" value={form.breed} onChange={handleChange} required />
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <AdminSelect label="Species" name="species" value={form.species} onChange={handleChange}
                options={["dog","cat","rabbit","bird","other"]} />
              <AdminField label="Age (years) *" name="age" type="number" value={form.age} onChange={handleChange} required min="0" step="0.5" />
              <AdminSelect label="Gender" name="gender" value={form.gender} onChange={handleChange}
                options={["male","female"]} />
              <AdminSelect label="Size" name="size" value={form.size} onChange={handleChange}
                options={["small","medium","large"]} />
            </div>

            {/* Row 3 */}
            <AdminField label="Location / Shelter *" name="location" value={form.location} onChange={handleChange} required />
            <AdminField label="Image URL (optional)" name="image" value={form.image} onChange={handleChange}
              placeholder="https://..." />
            <AdminField label="Personality (comma-separated)" name="personality" value={form.personality}
              onChange={handleChange} placeholder="e.g. playful, calm, loyal" />

            {/* Description textarea */}
            <div className="admin-field">
              <label className="admin-label">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="admin-input admin-textarea"
                required
                rows={3}
              />
            </div>

            {/* Checkboxes */}
            <div className="admin-checks">
              <label className="check-label">
                <input type="checkbox" name="vaccinated" checked={form.vaccinated} onChange={handleChange} />
                Vaccinated
              </label>
              <label className="check-label">
                <input type="checkbox" name="neutered" checked={form.neutered} onChange={handleChange} />
                Neutered
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-submit">
              ➕ Add Pet to Shelter
            </button>
          </form>
        </div>
      )}

      {/* ── Pet Management List ── */}
      <div className="admin-filter-bar">
        {["all","available","pending","adopted"].map((s) => (
          <button
            key={s}
            className={`filter-pill ${filterStatus === s ? "filter-pill--active" : ""}`}
            onClick={() => setFilterStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="admin-pet-list">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="admin-pet-row">

            {/* Thumbnail */}
            <img
              src={pet.image}
              alt={pet.name}
              className="admin-pet-thumb"
              onError={(e) => { e.target.style.display = "none"; }}
            />

            {/* Name & breed */}
            <div className="admin-pet-info">
              <strong>{pet.name}</strong>
              <span>{pet.breed} · {pet.species}</span>
            </div>

            {/* Status dropdown */}
            <select
              value={pet.status}
              onChange={(e) => updatePetStatus(pet.id, e.target.value)}
              className="admin-input admin-status-select"
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
            </select>

            {/* Delete */}
            <button className="btn btn-danger" onClick={() => handleDelete(pet.id)}>
              🗑 Remove
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ── Small reusable form helpers ── */

function AdminField({ label, ...props }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <input className="admin-input" {...props} />
    </div>
  );
}

function AdminSelect({ label, options, ...props }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <select className="admin-input" {...props}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
