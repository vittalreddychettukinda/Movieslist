import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
export function Lg() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", formData);
      console.log("Login Success:", res.data);
      
      // Save token in localStorage (optional but common)
      const token = res.data.token;
    if (token) {
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate('/listings');
    } else {
      alert("Token not received. Please try again.");
    }
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      alert("Invalid email or password.");
    }
  };
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 15, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
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
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  );
}
