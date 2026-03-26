import React from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

export default function Navbar() {
  const { favorites, applications } = useApp();

  // Count only pending applications
  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Brand / Logo */}
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon"> <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwCQiE78-g96q-4zhLpOmFbLdTQQyNuKCGTA&s"/></span>
          <span className="brand-name">PetsHome</span>
        </NavLink>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>

          <NavLink to="/favorites" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Favorites
            {/* Show a small badge if there are favorites */}
            {favorites.length > 0 && (
              <span className="nav-badge">{favorites.length}</span>
            )}
          </NavLink>

          <NavLink to="/applications" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Applications
            {pendingCount > 0 && (
              <span className="nav-badge">{pendingCount}</span>
            )}
          </NavLink>

          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin
          </NavLink>
        </div>

      </div>
    </nav>
  );
}
