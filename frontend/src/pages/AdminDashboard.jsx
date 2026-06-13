import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, rsvps: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/api/events"), api.get("/api/rsvps")])
      .then(([eventsRes, rsvpsRes]) => {
        setStats({
          events: eventsRes.data.length,
          rsvps: rsvpsRes.data.length,
        });
        setRecentEvents(eventsRes.data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <h2>{stats.events}</h2>
          <p>Total Events</p>
        </div>
        <div className="stat-card">
          <h2>{stats.rsvps}</h2>
          <p>Total RSVPs</p>
        </div>
      </div>

      <div className="admin-section">
        <h2>Manage</h2>
        <div className="admin-links">
          <Link to="/admin/events">Manage Events</Link>
          <Link to="/admin/users">Manage Users</Link>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Events</h2>
        {recentEvents.map((event) => (
          <div className="data-row" key={event._id}>
            <p>{event.title}</p>
            <p>
              {event.city} — {event.category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
