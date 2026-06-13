import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import api from "../api/axios";

export default function OrganizerProfilePage() {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/api/users/${id}`),
      api.get(`/api/events?organizerId=${id}`),
    ])
      .then(([userRes, eventsRes]) => {
        setOrganizer(userRes.data);
        setEvents(eventsRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!organizer) return <p>User not found.</p>;

  return (
    <div>
      <div className="organizer-header">
        <h1>{organizer.name}</h1>
        <p>{organizer.email}</p>
      </div>

      <h2 style={{ marginBottom: "32px" }}>Events by {organizer.name}</h2>
      {events.length === 0 && <p>No events yet.</p>}
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
          </Link>
        ))}
      </div>
    </div>
  );
}
