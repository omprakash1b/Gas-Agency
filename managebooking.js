import React, { useState, useEffect } from "react";
import "./ManageBookings.css";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [consumerId, setConsumerId] = useState("");
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/allbookings")
      .then((response) => response.json())
      .then((data) => {
        setAllBookings(data.results);
        setBookings(data.results); // Show all bookings initially
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const handleSearch = () => {
    if (consumerId.trim() === "") {
      setBookings(allBookings); // Reset to all bookings when input is empty
    } else {
      const filtered = allBookings.filter(
        (booking) => booking.customerId.toString() === consumerId
      );
      setBookings(filtered);
    }
  };

  const handleAllowAddon = (bookingId) => {
    fetch("http://localhost:5000/allowAddon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    })
      .then((response) => response.json())
      .then(() => {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, addons: 1 } : booking
          )
        );
      })
      .catch((error) => console.error("Error updating add-ons:", error));
  };

  return (
    <div className="container">
      <h1 className="title">Manage Bookings</h1>
      <input
        type="text"
        placeholder="Enter Consumer ID"
        value={consumerId}
        onChange={(e) => setConsumerId(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-btn">Search</button>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Date</th>
              <th>Cylinder Type</th>
              <th>Amount</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Add-ons</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.bookingId}</td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.cylinderType}</td>
                <td>${booking.amount.toFixed(2)}</td>
                <td>{booking.address}</td>
                <td>{booking.phone}</td>
                <td>
                  {booking.addons ? (
                    "Granted"
                  ) : (
                    <button onClick={() => handleAllowAddon(booking.bookingId)} className="addon-btn">
                      Allow Add-on
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
