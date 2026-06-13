import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function MyRSVPsPage() {
  const { user } = useAuth();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/rsvps?userId=${user.id}`)
      .then((res) => {
        setRsvps(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "32px" }}>My RSVPs</h1>
      {rsvps.length === 0 && <p>You haven't RSVP'd to any events yet.</p>}
      {rsvps.map((rsvp) => (
        <div className="rsvp-card" key={rsvp._id}>
          <p>{rsvp.event?.title || "Event unavailable"}</p>
          <p>
            {rsvp.event?.city} — {rsvp.event?.category}
          </p>
          <p className="status-badge">Status: {rsvp.status}</p>
        </div>
      ))}
    </div>
  );
}
