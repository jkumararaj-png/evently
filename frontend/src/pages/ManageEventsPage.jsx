import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    api
      .get("/api/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/api/events/${id}`, {});
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const res = await api.put(`/api/events/${id}`, updatedData);
      setEvents((prev) => prev.map((e) => (e._id === id ? res.data : e)));
      setEditingEvent(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "32px" }}>Manage Events</h1>

      {events.map((event) => (
        <div key={event._id}>
          {editingEvent?._id === event._id ? (
            <form
              className="edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit(event._id, {
                  title: editingEvent.title,
                  city: editingEvent.city,
                  category: editingEvent.category,
                });
              }}
            >
              <input
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
                placeholder="Title"
              />
              <input
                value={editingEvent.city}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, city: e.target.value })
                }
                placeholder="City"
              />
              <div className="row-actions">
                <button type="submit">Save</button>
                <button
                  className="ghost"
                  type="button"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="data-row">
              <p>{event.title}</p>
              <p>
                {event.city} — {event.category}
              </p>
              <div className="row-actions">
                <button
                  className="ghost"
                  onClick={() => setEditingEvent(event)}
                >
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
