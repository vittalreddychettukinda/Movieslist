import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, TextField, Button, Box } from '@mui/material';
import Scrolling from './Scrolling';  // Ensure Scrolling component is imported
import { ApiUrl } from './Configuration.js/Auth';
export function NewList() {
  const [data, setData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    rating: '',
    genre: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      return;
    }
    e.preventDefault();
    try {
      await axios.post(`${ApiUrl}/listings/new`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Or from wherever your token is stored
        },
      });
      alert('A new list is created');
      navigate('/listings');
    } catch (err) {
      console.log('error', err);
      alert('Error while creating list');
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ marginTop: 10 }}>
      <Grid item xs={12} sm={8} md={6} sx={{ padding: '20px' }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
          <h1>Add New List Here</h1>
          
          {/* Scrolling component */}
          <Scrolling />
          
          <TextField
            name="title"
            label="Title"
            value={data.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            name="description"
            label="Description"
            value={data.description}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
          />

          <TextField
            name="rating"
            label="Rating"
            type="number"
            value={data.rating}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            name="genre"
            label="Genre"
            value={data.genre}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            name="imageUrl"
            label="Image URL"
            value={data.imageUrl}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Create Listing
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
