import React, { useState, useEffect } from "react";
import "./BookingHistory.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch booking data (Replace with API call if needed)
    const fetchBookings = async () => {
      const data = [
        { id: 1, name: "John Doe", date: "2025-03-01", amount: "$200" },
        { id: 2, name: "Jane Smith", date: "2025-03-03", amount: "$350" },
        { id: 3, name: "Alice Brown", date: "2025-03-05", amount: "$150" },
      ];
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) =>
    booking.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="title">Booking History</h1>
      <input
        type="text"
        placeholder="Search by Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.name}</td>
                <td>{booking.date}</td>
                <td>{booking.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistory;
