const mongoose = require("mongoose");
const Movie=require("../models/listing.js");
const data = require("./data.js");
const mongoURL = 'mongodb://127.0.0.1:27017/movieslist';
async function connectDb() {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected successfully to MongoDB");  
    // Insert new data
    const insertedMovies = await Movie.insertMany(data);
    console.log("Movies inserted successfully:", insertedMovies);
    const movies = await Movie.find();
    console.log("Movies in the database:", movies);
  } catch (err) {
    console.error("Error while connecting/inserting to DB:", err);
  } finally {
    mongoose.connection.close(); // Close connection after operation
  }
}
connectDb();
