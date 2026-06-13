import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const CATEGORIES = [
  "Music",
  "Sports",
  "Competition",
  "Arts",
  "Food & Drink",
  "Community",
  "Other",
];

export default function CreateEventPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [createdEvent, setCreatedEvent] = useState(null); // triggers share modal
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    city: "",
    category: "Other",
    eventImg: "",
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/events", form);
      setCreatedEvent(res.data); // show share modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    }
  };

  const eventLink = createdEvent
    ? `${window.location.origin}/events/${createdEvent._id}`
    : "";

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Create an event</h1>
      <p style={{ marginBottom: 28 }}>
        Fill in the details and share your link.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Event title</label>
        <input
          value={form.title}
          onChange={set("title")}
          placeholder="e.g. KL Jazz Night"
          required
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={set("description")}
          placeholder="What's the event about?"
          required
        />
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
            marginTop: 4,
          }}
        >
          Supports markdown — **bold**, *italic*, [links](url), ![images](url)
        </p>

        <label>Date & time</label>
        <input
          type="datetime-local"
          value={form.date}
          onChange={set("date")}
          required
        />

        <label>Venue</label>
        <input
          value={form.venue}
          onChange={set("venue")}
          placeholder="e.g. The Rooftop Bar"
          required
        />

        <label>City</label>
        <input
          value={form.city}
          onChange={set("city")}
          placeholder="e.g. Kuala Lumpur"
          required
        />

        <label>Category</label>
        <select value={form.category} onChange={set("category")}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Image URL (optional)</label>
        <input
          value={form.eventImg}
          onChange={set("eventImg")}
          placeholder="https://..."
        />
        {form.image && (
          <img
            src={form.eventImg}
            alt="preview"
            style={{
              marginTop: 8,
              borderRadius: 8,
              maxHeight: 180,
              objectFit: "cover",
              width: "100%",
            }}
          />
        )}

        {error && <p className="error">{error}</p>}
        <button type="submit">Create event</button>
      </form>

      {/* Share modal */}
      {createdEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Event created!</h2>
            <p>Share this link with your attendees:</p>
            <div className="share-link">
              <input readOnly value={eventLink} />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(eventLink);
                }}
              >
                Copy
              </button>
            </div>
            <div className="row-actions" style={{ marginTop: 16 }}>
              <button onClick={() => navigate(`/events/${createdEvent._id}`)}>
                View event
              </button>
              <button className="ghost" onClick={() => navigate("/events")}>
                Browse events
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
