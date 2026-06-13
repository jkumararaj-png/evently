import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav>
      <div className="navbar-brand">
        <Link to="/">Evently</Link>
      </div>

      <div className="navbar-links">
        <Link to="/events">Browse Events</Link>
        {user && <Link to="/events/create">+ Create event</Link>}
        {user && <Link to="/my-rsvps">My RSVPs</Link>}
        {isAdmin && <Link to="/admin">Dashboard</Link>}
      </div>

      <div className="navbar-auth">
        <button
          className="ghost"
          onClick={() => setDark((d) => !d)}
          style={{ marginRight: "24px", fontSize: "1rem", padding: "6px" }}
          aria-label="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {user ? (
          <div className="navbar-user">
            <span>
              Hi,{" "}
              <Link
                to={`/organizers/${user.id}`}
                style={{ textDecoration: "none" }}
              >
                {user.name}
              </Link>
            </span>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <div className="navbar-guest">
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
