import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.put(`/api/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "32px" }}>Manage Users</h1>
      {users.map((u) => (
        <div key={u._id} className="data-row">
          <div>
            <p>{u.name}</p>
            <p>{u.email}</p>
            <span className={`role-badge ${u.role}`}>{u.role}</span>
          </div>
          <div className="row-actions">
            {u._id !== currentUser.id && (
              <>
                <button
                  className="ghost"
                  onClick={() => handleRoleToggle(u._id, u.role)}
                >
                  {u.role === "admin" ? "Make user" : "Make admin"}
                </button>
                <button className="danger" onClick={() => handleDelete(u._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
