import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import "./MyBookingHistory.css";

export default function MyBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve user ID
  const customerId = localStorage.getItem("userId");

  useEffect(() => {
    if (!customerId) {
      setError("User not logged in. Redirecting...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2s
      return;
    }

    fetch("http://localhost:5000/mybookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch booking history");
        }
        return response.json();
      })
      .then(data => {
        setBookings(data.results);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [customerId, navigate]);

  if (loading) return <p>Loading booking history...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="booking-history-container">
      <h2>My Cylinder Booking History</h2>
      {bookings.length === 0 ? (
        <p>No past bookings found.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Booking Date</th>
              <th>Cylinder Type</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.cylinderType}</td>
                <td>{booking.address}</td>
                <td>{booking.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
