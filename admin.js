import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="card-container">
        <div className="admin-card" onClick={() => navigate('/manage-bookings')}>
          <h3>Manage Bookings</h3>
          <p>View and update cylinder bookings</p>
        </div>
        <div className="admin-card" onClick={() => navigate('/user-registration')}>
          <h3>User Registration</h3>
          <p>Register new users and manage accounts</p>
        </div>
      </div>
    </div>
  );
}
