import React, { createContext, useContext, useState } from "react";
import { PETS } from "../data/pets";

// 1. Create a context (think of it as a shared box of data)
const AppContext = createContext();

// 2. A custom hook so other files can easily read from the box
export function useApp() {
  return useContext(AppContext);
}

// 3. The Provider wraps the whole app and holds the shared state
export function AppProvider({ children }) {

  // --- State ---
  const [pets, setPets] = useState(PETS);
  const [favorites, setFavorites] = useState([]); // list of pet ids
  const [applications, setApplications] = useState([]); // submitted forms

  // --- Actions ---

  // Add a pet id to favorites (or remove it if it's already there)
  function toggleFavorite(petId) {
    if (favorites.includes(petId)) {
      setFavorites(favorites.filter((id) => id !== petId));
    } else {
      setFavorites([...favorites, petId]);
    }
  }

  // Remove a pet from the shelter list
  function deletePet(petId) {
    setPets(pets.filter((p) => p.id !== petId));
    setFavorites(favorites.filter((id) => id !== petId));
  }

  // Add a brand new pet to the list
  function addPet(petData) {
    const newPet = {
      ...petData,
      id: "p" + Date.now(), // unique id using timestamp
      status: "available",
    };
    setPets([newPet, ...pets]);
  }

  // Change a pet's status (available / pending / adopted)
  function updatePetStatus(petId, newStatus) {
    setPets(pets.map((p) => (p.id === petId ? { ...p, status: newStatus } : p)));
  }

  // Submit an adoption application
  function submitApplication(petId, formData) {
    const newApplication = {
      id: Date.now(),
      petId,
      submittedAt: new Date().toLocaleDateString(),
      status: "pending",
      ...formData,
    };
    setApplications([newApplication, ...applications]);
    updatePetStatus(petId, "pending");
  }

  // --- Share everything via context ---
  return (
    <AppContext.Provider
      value={{
        pets,
        favorites,
        applications,
        toggleFavorite,
        deletePet,
        addPet,
        updatePetStatus,
        submitApplication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
