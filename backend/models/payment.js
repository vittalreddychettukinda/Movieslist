const mongoose=require("mongoose");
const paymentschema= new mongoose.Schema({
    userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
    },
    cardnumber:{
        type:String,
        required:true,
    },
    expiredate:{
        type:String,
        required:true,
    },
    cvv:{
         type:Number,
          required:true,
    },
    amount:{
        type:Number,
    },
    planType:{
           type:String,
    },
    paidAt:{
        type:Date,
        default:Date.now(),
    } 
});
const Payment=mongoose.model("Payment",paymentschema);
module.exports=Payment;