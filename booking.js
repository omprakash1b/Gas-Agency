import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CylinderBooking.css";

export default function CylinderBooking() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [customerId, setCustomerId] = useState(null); // Initialize as null
  const [cylinderType, setCylinderType] = useState("Standard");
  const [error, setError] = useState("");
  const [isAddressEditable, setIsAddressEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);
  const navigate = useNavigate();

  // ✅ Get customer ID from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setCustomerId(storedUserId);
    } else {
      setError("No customer ID found. Please log in.");
    }
  }, []);

  // ✅ Fetch user details when customerId is available
  useEffect(() => {
    if (customerId) {
      fetch(`http://localhost:5000/get-user?customerId=${customerId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setName(data.name);
            setAddress(data.address);
            setPhone(data.phonenumber);
          }
        })
        .catch(() => setError("Failed to load user data"));
    }
  }, [customerId]);

  // ✅ Update Address or Phone
  const handleUpdate = async (field, value) => {
    try {
      const response = await fetch("http://localhost:5000/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, field, value }),
      });

      const result = await response.json();
      if (result.success) {
        alert(`${field} updated successfully!`);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Update failed");
    }
  };

  // ✅ Handle Cylinder Booking
  const handleBooking = async () => {
    if (!customerId || !address || !phone) {
      setError("Please provide complete details");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/book-cylinder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, cylinderType, address, phone }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Booking Successful! Booking ID: " + result.bookingId);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Booking failed");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>Cylinder Booking</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <label>Name</label>
          <input type="text" value={name} readOnly disabled />
        </div>

        <div className="input-group">
          <label>Customer ID</label>
          <input type="text" value={customerId || ""} readOnly disabled />
        </div>

        <div className="input-group">
          <label>Address</label>
          <div className="input-container">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              readOnly={!isAddressEditable}
            />
            <button
              onClick={() => {
                if (isAddressEditable) handleUpdate("address", address);
                setIsAddressEditable(!isAddressEditable);
              }}
            >
              {isAddressEditable ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Phone</label>
          <div className="input-container">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!isPhoneEditable}
            />
            <button
              onClick={() => {
                if (isPhoneEditable) handleUpdate("phone", phone);
                setIsPhoneEditable(!isPhoneEditable);
              }}
            >
              {isPhoneEditable ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Cylinder Type</label>
          <select value={cylinderType} onChange={(e) => setCylinderType(e.target.value)}>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <button className="booking-button" onClick={handleBooking}>
          Book Now
        </button>

        <button className="booking-button" onClick={()=>{navigate('/mybooking-history')}}>
          Show Booking History
        </button>
      </div>
    </div>
  );
}
