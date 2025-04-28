import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { Grid, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from './Configuration.js/Auth';
export default function Show() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${ApiUrl}/listings`)
      .then(response => {
        setMovies(response.data);
        console.log("Fetched Movies:", response.data);
        setFilteredMovies(response.data); // Set filtered also initially
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  const handleNavigation = (event, id) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view this listing.");
      return;
    }
    navigate(`/listings/${id}`);
  };

  const handleEditNavigation = async (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to edit.");
      return;
    }

    try {
      await axios.get(`${ApiUrl}/listings/${id}/edit`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/listings/${id}/edit`);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        if (error.response.status === 403) {
          alert("You are not authorized to edit this listing.");
        } else {
          alert(`Error: ${error.response.data.message || "Failed to check access rights."}`);
        }
      } else {
        alert("Failed to connect to the server. Please try again.");
      }
    }
  };

  const handleDelete = async (event, id) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }
    try {
      await axios.delete(`${ApiUrl}/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(prev => prev.filter(movie => movie._id !== id));
      setFilteredMovies(prev => prev.filter(movie => movie._id !== id));
      alert('List is deleted');
    } catch (error) {
      console.error("Error while deleting the movie", error);
      if (error.response && error.response.status === 403) {
        alert("You are not authorized to delete this movie.");
      }
    }
  };

  const filterMovies = (genre) => {
    if (genre === "All") {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => movie.genre?.toLowerCase() === genre.toLowerCase());
      setFilteredMovies(filtered);
    }
  };

  return (
    <>
      <Box sx={{ mt: 4, ml: 3 }}>
        {/* Filter Buttons */}
        <Grid container spacing={2} sx={{ mb: 4, mt: 15 }}>
  <Grid item xs={6} sm={4} md={2}>
    <Button fullWidth variant="contained" color="primary" onClick={() => filterMovies("All")}>
      All Movies
    </Button>
  </Grid>
  <Grid item xs={6} sm={4} md={2}>
    <Button fullWidth variant="outlined" color="secondary" onClick={() => filterMovies("Comedy")}>
      Comedy
    </Button>
  </Grid>
  <Grid item xs={6} sm={4} md={2}>
    <Button fullWidth variant="outlined" color="error" onClick={() => filterMovies("Horror")}>
      Horror
    </Button>
  </Grid>
  <Grid item xs={6} sm={4} md={2}>
    <Button fullWidth variant="outlined" color="success" onClick={() => filterMovies("Action")}>
      Action
    </Button>
  </Grid>
  <Grid item xs={6} sm={4} md={2}>
    <Button fullWidth variant="outlined" color="warning" onClick={() => filterMovies("Drama")}>
      Drama
    </Button>
  </Grid>
</Grid>


        {/* Movie Cards */}
        <Grid container spacing={2}>
          {filteredMovies.map((movie) => (
            <Grid key={movie._id} item xs={12} sm={6} md={3} lg={4}>
              <Card
                sx={{
                  width: 300,
                  height: 350,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginTop: 3,
                  cursor: 'pointer',
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: '0.3s',
                  '&:hover': { boxShadow: 20 }
                }}
                onClick={(event) => handleNavigation(event, movie._id)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={movie.imageUrl}
                  alt={movie.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    <b>{movie.title}</b>
                    <hr />
                  </Typography>
                  <Typography variant="h7" color="text.secondary">
                    ⭐ <strong> <b>Rating:</b></strong> {movie.rating}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEditNavigation(event, movie._id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={(event) => handleDelete(event, movie._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
