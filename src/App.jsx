import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

export default function App() {
  return (
    // AppProvider makes our shared state available to every component inside it
    <AppProvider>
      <div className="app">

        <Navbar />

        {/* Page content changes based on the URL */}
        <main className="app-main">
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/favorites"    element={<FavoritesPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/admin"        element={<AdminPage />} />
            {/* Catch-all: if route not found, go to home */}
            <Route path="*"             element={<HomePage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          🐾 PawsHome · Made with love for animals · Nepal
        </footer>

      </div>
    </AppProvider>
  );
}
