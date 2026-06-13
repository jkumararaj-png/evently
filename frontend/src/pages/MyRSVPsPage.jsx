import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function MyRSVPsPage() {
  const { user } = useAuth();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    api
      .get(`/api/rsvps?userId=${user.id}`)
      .then((res) => {
        setRsvps(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = async (id) => {
    try {
      const res = await api.put(`/api/rsvps/${id}`, editData);
      setRsvps((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...res.data } : r)),
      );
      setEditingId(null);
    } catch (err) {
      alert("Failed to update RSVP");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: 32 }}>My RSVPs</h1>
      {rsvps.length === 0 && <p>You haven't RSVP'd to any events yet.</p>}
      {rsvps.map((rsvp) => (
        <div className="rsvp-card" key={rsvp._id}>
          {editingId === rsvp._id ? (
            <div style={{ flex: 1 }}>
              <label htmlFor="status">Status</label>
              <select
                name="status"
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="going">Going</option>
                <option value="maybe">Maybe</option>
                <option value="not going">Not going</option>
              </select>

              <label style={{ marginTop: 15 }} htmlFor="phone">
                Contact Number
              </label>
              <input
                name="phone"
                value={editData.phone || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                placeholder="+60 12 345 6789"
              />

              <label style={{ marginTop: 15 }} htmlFor="notes">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={editData.notes || ""}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                placeholder="Any dietary requirements, questions, etc."
              />
              <div className="row-actions" style={{ marginTop: 8 }}>
                <button onClick={() => handleEdit(rsvp._id)}>Save</button>
                <button className="ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <p style={{ fontWeight: 600, color: "var(--color-text)" }}>
                  {rsvp.event?.title || "Event unavailable (deleted/removed)"}
                </p>
                <p>
                  {rsvp.event?.city} — {rsvp.event?.category}
                </p>
                {rsvp.phone && <p>📞 {rsvp.phone}</p>}
                {rsvp.notes && <p>💬 {rsvp.notes}</p>}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "flex-end",
                }}
              >
                <span className="status-badge">{rsvp.status}</span>
                {rsvp.event?.title && (
                  <button
                    className="ghost"
                    style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                    onClick={() => {
                      setEditingId(rsvp._id);
                      setEditData({
                        status: rsvp.status,
                        phone: rsvp.phone,
                        notes: rsvp.notes,
                      });
                    }}
                  >
                    Edit RSVP details
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
