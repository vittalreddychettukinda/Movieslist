const mongoose=require("mongoose");
const Movie=require("../models/listing.js");
const reviewSchema=new mongoose.Schema({
     rating:{
        type:Number, 
        required:true,
     },
     comment:{
        type:String,
       
     },
     movieid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required:true,
     },
     user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User",
         required:true,
     }
},{ timestamps: true });
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;