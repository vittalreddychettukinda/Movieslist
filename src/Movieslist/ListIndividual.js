import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { ApiUrl } from "./Configuration.js/Auth";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Stack,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";

export function ListIndividual() {
  const [movies, setMovies] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const response = await axios.delete(`${ApiUrl}/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
      alert("Listing deleted successfully.");
    } catch (error) {
      console.error("Error while deleting the movie", error);
      if (error.response && error.response.status === 403) {
        alert("You are not authorized to delete this movie.");
      } else {
        alert("Failed to delete the movie.");
      }
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${ApiUrl}/listings?search=${searchQuery}`);
        const data = await res.json();
        if (data.length === 0) {
          alert("No movies found with this name.");
        }
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
        alert("Failed to fetch movies.");
      }
    };

    fetchMovies();
  }, [searchQuery]);

  return (
    <Box sx={{ mt: 8, ml: 3 }}>
      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid key={movie._id} item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                width: 300,
                height: 350,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                marginTop: 3,
                cursor: "pointer",
                boxShadow: 3,
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": { boxShadow: 20 },
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
                <Typography variant="body2" color="text.secondary">
                  ⭐ <strong>Rating:</strong> {movie.rating}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
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
  );
}
