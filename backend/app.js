const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Movie = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/users.js");
const Pay=require("./models/payment.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const mongoURL = 'mongodb://127.0.0.1:27017/moiveslist';
async function ConnectDb() {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected successfully");
  } catch (err) {
    console.log("Error while connecting to DB", err);
  }
}

ConnectDb();

// Token generation function
const generateToken = (user) => {
  return jwt.sign({ id: user._id, name: user.name, email: user.email}, "Vittal", {
    expiresIn: "1d",
  });
};

// Authentication middleware
const authenticate = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // If no token is provided, send a 401 Unauthorized response
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, "Vittal");

    // Attach the decoded user information to the request object
    req.user = decoded;
  
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If the token is invalid, send a 401 Unauthorized response
    res.status(401).json({ message: "Invalid Token" });
  }
};

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/listings", async (req, res) => {
  const { genre } = req.query;
  try{
    const filter = genre ? { genre: genre.toLowerCase() }: {};
    const movies = await Movie.find(filter);
    res.status(200).json(movies);
  } catch (err) {
    console.error("Error while getting the data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});





// Create a new listing
app.post("/listings/new", authenticate, async (req, res) => {
  const { title, description, imageUrl, rating,genre } = req.body;
  try {
    const newListing = new Movie({
      title,
      description,
      imageUrl,
      rating,
      genre,
      created_by: req.user.id,
    });
    await newListing.save();
    res.status(201).json({ message: "Listing created successfully!", listing: newListing });
  } catch (error) {
    console.error("Error while creating listing:", error);
    res.status(500).json({ error: "Something went wrong while creating list." });
  }
});

app.get("/listings/:id/edit", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    // Check if the user is the creator
    if (!movie.created_by || movie.created_by.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to edit this listing." });
    }

    // Authorized
    res.status(200).json(movie);
  } catch (err) {
    console.error("Error in edit GET route:", err);
    res.status(500).json({ error: "Something went wrong while fetching movie" });
  }
});


app.put("/listings/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, rating, imageUrl,genre } = req.body;

  try {
    const updatedMovie = await Movie.findById(id);
    if (!updatedMovie) return res.status(404).json({ error: "Movie not found" });

    if (!updatedMovie.created_by || updatedMovie.created_by.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to edit this listing." });
    }
    const updatedData = await Movie.findByIdAndUpdate(
      id,
      { title, description, rating, imageUrl ,genre },
      { new: true }
    );
    res.status(200).json(updatedData);
  } catch (err) {
    console.log("Error while updating from backend:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.delete("/listings/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    if (!movie.created_by || movie.created_by.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this listing." });
    }

    await Movie.findByIdAndDelete(id);
    return res.status(200).json({ message: "Movie is deleted" });

  } catch (error) {
    console.error("Error while deleting from backend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// for movie by id

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const movie = await Movie.findById(id)
      // .populate("created_by", "name email")
      .populate({
        path: "review",
        populate: {
          path: "user",
          select: "name"
        }
      });

    if (!movie) {
      return res.status(404).json({ err: "Movie not found" });
    }
    return res.status(200).json(movie);
  } catch (err) {
    console.log("Error while getting the data", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a review
app.post("/listings/:id/reviews", authenticate, async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  try {
    const review = new Review({
      comment,
      rating,
      movieid: id,
      user: req.user.id,
    });

    await review.save();

    await Movie.findByIdAndUpdate(id, {
      $push: { review: review._id },
    });

    // Populate the user's name before sending response
    const populatedReview = await Review.findById(review._id).populate('user', 'name');
    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});
app.get("/listings/:id/reviews", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id).populate({
      path: 'review',
      populate: { path: 'user', select: 'name' }
    });
    res.json(movie.review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Delete review
app.delete("/listings/:id/reviews/:reviewId", authenticate, async (req, res) => {
  const { id, reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).send("Review not found");

    if (review.user.toString() !== req.user.id) {
      return res.status(403).send("You are not authorized to delete this review");
    }
    await Review.findByIdAndDelete(reviewId);
    await Movie.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    res.status(200).send({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting review", error });
  }
});

// User signup
app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });
    const user = new User({ email, password, name });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email is not valid" });

  if(password!=user.password) return res.status(400).json({ message: "Invalid password" });  
    const token = generateToken(user._id);
    res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.post("/logout", async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});
// profile
app.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'favorites',
        model: 'Movie', 
        select: 'title' ,
      }).populate({
        path:'subscription.paymentId',
        model:'Payment',
        select:'planType amount paidAt'
      });

     
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// favourite movie
// Example route in Express.js
app.post('/user/favourite', authenticate, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Make sure favorites array exists
    if (!Array.isArray(user.favorites)) {
      user.favorites = [];
    }

    // Check if movie already in favorites
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ error: 'Movie already added to favorites' });
    }
    user.favorites.push(movieId);
    await user.save();
    return res.status(200).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Error in /user/favourite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// payment for subcription
app.post('/payment', authenticate, async (req, res) => {
  console.log('Authenticated User:', req.user);  // Check if user data is attached correctly
  try {
    // Create the payment
    const payment = new Pay({
      userId: req.user.id,  // Make sure userId is coming from req.user
      cardnumber: req.body.cardnumber,
      expiredate: req.body.expiredate,
      cvv: req.body.cvv,
      amount: req.body.amount,
      planType: req.body.planType,
    });

    // Log the payment to ensure userId is set
    console.log(payment);

    // Save the payment
    await payment.save();

    // Now update the User model (for example, to track the payment or subscription details)
    const user = await User.findById(req.user.id); // Find user by userId

    // Update the user with the new payment details
    user.set({
      subscription: {
        paymentId: payment._id,
        planType: req.body.planType, // You can track the planType here
      },
    });

    // Save the updated user information
    await user.save();

    // Respond with a success message
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating payment or updating user', error });
  }
});






app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
