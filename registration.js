import React, { useState } from "react";
import "./UserRegistration.css";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User Registered:", formData);

    try {
      const response = await fetch("http://localhost:5000/user-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccess("Registration successful!");
      setError("");
      alert("Registration Successful!");

      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
      setSuccess(""); // Reset success message on error
    }
  };

  return (
    <div className="registration-container">
      <h2>User Registration</h2>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

        <label>Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default UserRegistration;
