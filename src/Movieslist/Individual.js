import * as React from 'react';
import {
  Card, CardActions, CardContent, CardMedia,
  Button, Typography, TextField, Stack,
  Paper, Rating, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrl } from './Configuration.js/Auth';
export function Individual() {
  const [reviews, setReviews] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios.get(`${ApiUrl}/listings/${id}`)
      .then(response => setMovie(response.data))
      .catch(err => console.error("Error fetching movie:", err));

    axios.get(`${ApiUrl}/listings/${id}/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setReviews(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  }, [id, token]);

  const handleChange = (e) => setComment(e.target.value);
  const handleRatingChange = (e, newValue) => setRating(newValue);
  const handleEditNavigation = (event, id) => {
    event.preventDefault();
    navigate(`/listings/${id}/edit`);
  };

  const handleSubmit = () => {
    if (!token) {
      alert('Please log in to submit a review');
      return;
    }

    axios.post(`${ApiUrl}/listings/${id}/reviews`, { comment, rating }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setReviews(prev => [...prev, res.data]);
        setComment('');
        setRating(0);
      })
      .catch(err => console.error(err));
  };

  const handleDeleteReview = (revId) => {
    axios.delete(`${ApiUrl}/listings/${id}/reviews/${revId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setReviews(prev => prev.filter(review => review._id !== revId)))
      .catch(err => console.log("Error while deleting the review:", err));
  };

  const handleDeleteMovie = (event, movieId) => {
    event.preventDefault();
    axios.delete(`${ApiUrl}/listings/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert("Movie deleted successfully!");
        navigate("/");
      })
      .catch(err => {
        console.error("Error deleting movie:", err);
        alert("Failed to delete movie.");
      });
  };

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${ApiUrl}/user/favourite`,
        { movieId: movie._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Movie added to favorites!");
  
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>No movie data found</div>;

  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': { color: '#ff6d75' },
    '& .MuiRating-iconHover': { color: '#ff3d47' },
  });

  return (
    <>
      <Box sx={{
        mt: 10, textAlign: 'center', justifyContent: 'center', ml: 3,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <Card sx={{
          width: { xs: '100%', sm: 400 }, height: 580, display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between', marginTop: 3,
          cursor: 'pointer', boxShadow: 3, borderRadius: 2, transition: '0.3s',
          '&:hover': { boxShadow: 20 }
        }}>
          <CardMedia component="img" height="180" image={movie.imageUrl} alt={movie.title} />
          <CardContent>
            <Typography gutterBottom variant="h6"><b>{movie.title}</b><hr /></Typography>
            <Typography variant="body2"><strong>Description:</strong> {movie.description}</Typography>
            <hr />
            <Typography variant="body2"><strong>Genre:</strong> {movie.genre}</Typography>
            <hr />
            <Typography variant="body2">⭐ <strong>Rating:</strong> {movie.rating}</Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" endIcon={<SendIcon />} onClick={(e) => handleEditNavigation(e, movie._id)}>Edit</Button>
              <Button variant="outlined" startIcon={<DeleteIcon />} onClick={(e) => handleDeleteMovie(e, movie._id)}>Delete</Button>
              <Button variant="outlined" startIcon={<FavoriteIcon />} onClick={(e) => handleFavorite(e, movie._id)}>Add to Favorites</Button>
            </Stack>
          </CardActions>
        </Card>
      </Box>

      <hr />
      <h1 style={{ color: "#fc0330" }}>Leave the Review Here</h1>

      <Box sx={{
        display: "flex", flexDirection: "column", gap: 2, p: 2,
        width: { xs: "100%", sm: "80%", md: "60%" }, mx: "auto",
        '& > legend': { mt: 2 }
      }}>
        <Typography component="legend">10 stars</Typography>
        <Rating name="rating" defaultValue={2} max={10} value={rating} onChange={handleRatingChange} />
        <TextField label="Comment" multiline rows={4} value={comment} fullWidth onChange={handleChange} margin="normal" />
        <Button variant="contained" color="success" onClick={handleSubmit} sx={{ alignSelf: "flex-start", mt: 1 }}>Submit</Button>
      </Box>

      <hr />
      <h1>All Reviews</h1>

      <Box sx={{
        mt: 2, mx: "auto", width: { xs: "100%", sm: "90%", md: "70%" },
        display: "flex", flexDirection: "column", gap: 2
      }}>
        {reviews.map((rev, index) => (
          <Paper key={index} elevation={3} sx={{
            p: 2, display: "flex", flexDirection: "column", gap: 1,
            '&:hover': { boxShadow: 20 },
          }}>
            <Typography variant="body1">@{rev.user?.name || "Anonymous"}</Typography>
            <Typography variant="body1">⭐ {rev.rating}</Typography>
            <Typography variant="body2">{rev.comment}</Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDeleteReview(rev._id)}
              sx={{ alignSelf: "flex-start" }}
            >
              Delete
            </Button>
          </Paper>
        ))}
      </Box>
    </>
  );
}
