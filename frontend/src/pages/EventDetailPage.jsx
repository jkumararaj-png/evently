import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import MDEditor from "@uiw/react-md-editor";
import api from "../api/axios";

export default function EventDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyRsvpd, setAlreadyRsvpd] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [rsvpData, setRsvpData] = useState({
    name: user?.name || "",
    email: "",
    phone: "",
    status: "going",
    notes: "",
  });
  const [rsvps, setRsvps] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    Promise.all([
      api.get(`/api/events/${id}`),
      api.get(`/api/reviews?eventId=${id}`),
      api.get(`/api/rsvps?eventId=${id}`),
    ])
      .then(([eventRes, reviewsRes, rsvpsRes]) => {
        setEvent(eventRes.data);
        setReviews(reviewsRes.data);
        setRsvps(rsvpsRes.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Event not found");
        setLoading(false);
      });

    // check if user already RSVP'd
    if (user) {
      api
        .get(`/api/rsvps?eventId=${id}&userId=${user.id}`)
        .then((res) => {
          if (res.data.length > 0) setAlreadyRsvpd(true);
        })
        .catch(() => {});
    }
  }, [id]);

  const handleRSVP = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/rsvps", { event: id, ...rsvpData });
      setRsvpDone(true);
      setShowRsvpForm(false);
      setAlreadyRsvpd(true);
    } catch (err) {
      setError(err.response?.data?.message || "RSVP failed");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/events/${id}`, editData);
      setEvent(res.data);
      setShowEditForm(false);
    } catch (err) {
      alert("Failed to update event");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return null;

  return (
    <div className="event-detail">
      {event.eventImg && (
        <img
          src={event.eventImg}
          alt={event.title}
          className="event-detail-img"
        />
      )}
      <h1>{event.title}</h1>

      <div className="event-meta">
        <p>
          📍 {event.venue}, {event.city}
        </p>
        <p>📅 {new Date(event.date).toLocaleDateString()}</p>
        <p>🏷️ {event.category}</p>
        {event.organizer && (
          <p>
            👤 Organised by{" "}
            <Link to={`/organizers/${event.organizer._id}`}>
              {event.organizer.name}
            </Link>
          </p>
        )}
      </div>

      <div className="event-description">
        <MDEditor.Markdown source={event.description} />
      </div>

      {/* RSVP section */}
      <div className="event-actions">
        {/* RSVP section — only show if event hasn't passed */}
        {new Date(event.date) > new Date() ? (
          <>
            {!user && (
              <p>
                <Link to="/login">Log in</Link> to RSVP
              </p>
            )}

            {user && (alreadyRsvpd || rsvpDone) && (
              <p className="status-badge">✓ You're going!</p>
            )}

            {user && event.organizer && user.id === event.organizer._id && (
              <>
                <div className="row-actions">
                  {user && !alreadyRsvpd && !rsvpDone && !showRsvpForm && (
                    <button onClick={() => setShowRsvpForm(true)}>
                      RSVP to this event
                    </button>
                  )}
                  <button
                    className="ghost"
                    onClick={() => {
                      setEditData({
                        title: event.title,
                        description: event.description,
                        date: new Date(event.date).toISOString().slice(0, 16),
                        venue: event.venue,
                        city: event.city,
                        category: event.category,
                        eventImg: event.eventImg,
                      });
                      setShowEditForm(!showEditForm);
                    }}
                  >
                    Edit event
                  </button>
                  <button
                    className="danger"
                    onClick={async () => {
                      if (!window.confirm("Delete this event?")) return;
                      await api.delete(`/api/events/${id}`);
                      navigate("/");
                    }}
                  >
                    Delete event
                  </button>
                </div>

                {showEditForm && (
                  <form onSubmit={handleEdit} className="rsvp-form">
                    <h2>Edit Event</h2>
                    <label>Title</label>
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                      required
                    />
                    <label>Description</label>
                    <MDEditor
                      value={editData.description}
                      onChange={(val) =>
                        setEditData({ ...editData, description: val || "" })
                      }
                      height={300}
                    />
                    <label>Date & time</label>
                    <input
                      type="datetime-local"
                      value={editData.date}
                      onChange={(e) =>
                        setEditData({ ...editData, date: e.target.value })
                      }
                      required
                    />
                    <label>Venue</label>
                    <input
                      value={editData.venue}
                      onChange={(e) =>
                        setEditData({ ...editData, venue: e.target.value })
                      }
                      required
                    />
                    <label>City</label>
                    <input
                      value={editData.city}
                      onChange={(e) =>
                        setEditData({ ...editData, city: e.target.value })
                      }
                      required
                    />
                    <label>Category</label>
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                    >
                      {[
                        "Music",
                        "Sports",
                        "Competition",
                        "Arts",
                        "Food & Drink",
                        "Community",
                        "Other",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <label>Image URL</label>
                    <input
                      value={editData.eventImg}
                      onChange={(e) =>
                        setEditData({ ...editData, eventImg: e.target.value })
                      }
                      placeholder="https://..."
                    />
                    {editData.eventImg && (
                      <img
                        src={editData.eventImg}
                        alt="preview"
                        style={{
                          borderRadius: 8,
                          maxHeight: 160,
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    )}
                    <div className="row-actions">
                      <button type="submit">Save changes</button>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => setShowEditForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {user && !alreadyRsvpd && !rsvpDone && showRsvpForm && (
              <form onSubmit={handleRSVP} className="rsvp-form">
                <h2>RSVP Form</h2>
                <label>Full name</label>
                <input
                  value={rsvpData.name}
                  onChange={(e) =>
                    setRsvpData({ ...rsvpData, name: e.target.value })
                  }
                  placeholder="Your name"
                  required
                />
                <label>Email</label>
                <input
                  type="email"
                  value={rsvpData.email}
                  onChange={(e) =>
                    setRsvpData({ ...rsvpData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  required
                />
                <label>Contact number</label>
                <input
                  type="tel"
                  pattern="[0-9+\s\-]*"
                  value={rsvpData.phone}
                  onChange={(e) =>
                    setRsvpData({ ...rsvpData, phone: e.target.value })
                  }
                  placeholder="+60 12 345 6789"
                />
                <label>Attendance</label>
                <select
                  value={rsvpData.status}
                  onChange={(e) =>
                    setRsvpData({ ...rsvpData, status: e.target.value })
                  }
                >
                  <option value="going">Going</option>
                  <option value="maybe">Maybe</option>
                  <option value="not going">Not going</option>
                </select>
                <label>Notes (optional)</label>
                <textarea
                  value={rsvpData.notes}
                  onChange={(e) =>
                    setRsvpData({ ...rsvpData, notes: e.target.value })
                  }
                  placeholder="Any dietary requirements, questions, etc."
                />
                {error && <p className="error">{error}</p>}
                <div className="row-actions">
                  <button type="submit">Confirm RSVP</button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => setShowRsvpForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <p>This event has already taken place.</p>
        )}
        {user && new Date(event.date) < new Date() && (
          <Link to={`/review/${id}`}>
            <button className="ghost">Leave a review</button>
          </Link>
        )}
      </div>

      {/* RSVP list - only visible to the organizer */}
      {user && event.organizer && user.id === event.organizer._id && (
        <div className="rsvp-list">
          <h2>RSVPs ({rsvps.length})</h2>
          {rsvps.length === 0 && <p>No RSVPs yet.</p>}
          {rsvps.map((rsvp) => (
            <div key={rsvp._id} className="rsvp-list-card">
              <div>
                <p className="rsvp-name">{rsvp.name || rsvp.user?.name}</p>
                <p>{rsvp.email || rsvp.user?.email}</p>
                {rsvp.phone && <p>📞 {rsvp.phone}</p>}
                {rsvp.notes && <p>💬 {rsvp.notes}</p>}
              </div>
              <span className="status-badge">{rsvp.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      <div className="reviews">
        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <p>
              {review.user?.name} — {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
