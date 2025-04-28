import { Button, TextField, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiUrl } from "./Configuration.js/Auth";
export function EditList() {
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    imageUrl: '',
    rating: '',
    genre:'',
  });
  
  const [errorMessage, setErrorMessage] = useState(null);  // For error handling
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    axios.get(`${ApiUrl}/listings/${id}/edit`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        setMovie(response.data);
      })
      .catch(error => {
        console.log("Error while getting movie", error);
        if (error.response && error.response.status === 403) {
          setErrorMessage("You are not authorized to edit this listing.");
        } else {
          setErrorMessage("Failed to load the movie data.");
        }
      });
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }
    try {
      await axios.put(`${ApiUrl}/listings/${id}`, movie, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert('List is updated');
      navigate('/listings'); 
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setErrorMessage("You are not authorized to edit this listing.");
      } else {
        console.log('error', err);
        alert('Error while updating list');
      }
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setMovie((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Grid container justifyContent="center" margin={10}>
      <form onSubmit={handleSubmit} style={{ padding: '20px', width: '100%', maxWidth: '500px' }}>
        <h1>Edit the List Here</h1>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}  {/* Show error message */}

        <TextField
          name="title"
          label="Title"
          value={movie.title}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={movie.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          margin="normal"
        />


<TextField
  name="genre"
  label="Genre"    
  value={movie.genre}
  onChange={handleChange}
  fullWidth
  required
  margin="normal"
/>


        <TextField
          name="rating"
          label="Rating"
          type="number"
          value={movie.rating}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="imageUrl"
          label="Image URL"
          value={movie.imageUrl}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Update
        </Button>
      </form>
    </Grid>
  );
}
