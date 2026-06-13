import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function LeaveReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/reviews", {
        event: id,
        rating: rating,
        comment: comment,
      });
      setSubmitted(true);
      setTimeout(() => navigate(`/events/${id}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (submitted) return <p>Review submitted! Redirecting...</p>;

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h1>Leave a Review</h1>

      <label>Rating (1-5)</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />

      <label>Comment</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think?"
      />

      {error && <p className="error">{error}</p>}
      <button type="submit">Submit Review</button>
    </form>
  );
}
