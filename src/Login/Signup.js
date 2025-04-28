import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
export function Signup() {
  const navigate=useNavigate();
  // Step 1: Create state to store form values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Step 2: Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 3: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/signup", formData); // change URL as needed
      console.log("Signup Success:", response.data);
      alert("Signup successful!");
      navigate("/login");
    
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      alert("Signup failed. Try again.");
    }
  };
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 15, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth  onClick={handleSubmit} sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </form>
    </Box>
  );
}
