import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="hero">
        <h1>One link for every event</h1>
        <p>
          RSVP, get details, and leave reviews — all without juggling separate
          tools.
        </p>
        <div className="hero-buttons">
          <Link to="/events">Browse Events</Link>
          {!user && <Link to="/register">Get started</Link>}
        </div>
      </div>

      <div className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Organizer creates an event</h3>
            <p>Add your event details and get a shareable link in seconds.</p>
          </div>
          <div className="step">
            <h3>2. Share one link</h3>
            <p>Put it on your flyer, poster, or social media. That's it.</p>
          </div>
          <div className="step">
            <h3>3. Attendees RSVP and review</h3>
            <p>
              Everything happens in one place — no redirects, no juggling forms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
