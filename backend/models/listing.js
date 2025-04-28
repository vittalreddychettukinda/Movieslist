const mongoose=require("mongoose");
const movieSchema=new mongoose.Schema({
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        imageUrl:{
            type:String,
            
        },
        genre:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            min:1,
            max:10,
            required:true,
        },
        review:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }]
        ,
         created_by:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }   
});
const Movie=mongoose.model("Movie",movieSchema);
module.exports=Movie;