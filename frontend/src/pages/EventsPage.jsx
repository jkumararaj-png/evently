import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

const CATEGORIES = [
  "",
  "Music",
  "Sports",
  "Competition",
  "Arts",
  "Food & Drink",
  "Community",
  "Other",
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchEvents = (s = search, c = category) => {
    const params = new URLSearchParams();
    if (s) params.append("search", s);
    if (c) params.append("category", c);
    api
      .get(`/api/events?${params.toString()}`)
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // initial load
  useEffect(() => {
    fetchEvents();
  }, []);

  // live category switch
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    fetchEvents(search, e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="events-page">
      <h1>Browse Events</h1>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or city..."
        />
        <select value={category} onChange={handleCategoryChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c || "All categories"}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
        <button
          type="button"
          className="ghost"
          onClick={() => {
            setSearch("");
            setCategory("");
            fetchEvents("", "");
          }}
        >
          Clear
        </button>
      </form>

      {events.length === 0 && <p>No events found.</p>}
      <div className="events-grid">
        {events.map((event) => (
          <Link
            to={`/events/${event._id}`}
            key={event._id}
            className="event-card"
          >
            {event.eventImg && (
              <img
                src={event.eventImg}
                alt={event.title}
                className="event-card-img"
              />
            )}
            <h2>{event.title}</h2>
            <p>
              {event.city} — {event.category}
            </p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.venue}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
