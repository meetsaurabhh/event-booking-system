import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">EventBooking</Link>
      </div>
      <div className="nav-right">
        <Link to="/events">Events</Link>
        {user && <Link to="/my-bookings">My Bookings</Link>}
        {user && user.role === "admin" && <Link to="/admin/events">Admin</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <button onClick={handleLogout} className="btn-link">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;