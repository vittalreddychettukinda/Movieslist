const mongoose = require("mongoose");
// Create the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  favorites: {
    type: [String],
    default: [] ,
  },
  subscription: {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    }
  }
});

// Hash password before saving (only if it's new or modified)
userSchema.pre("save", async function (next) {
    next();
  
});
// Create and export model
const User = mongoose.model("User", userSchema);
module.exports = User;
