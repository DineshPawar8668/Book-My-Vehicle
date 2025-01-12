import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
     
    },
    password:{
      type:String,
    },
    role: {
      type: String,
      enum: ["User", "Driver", "Admin", "VOwner"], 
      default: "User",
    },
    vehicle: {
      type: ObjectId,
      ref: "Vehicle",
    },
    deleted:{
      type:Boolean,
      default:false,
    },
    location: {
      type: { 
        type: String, 
        enum: ['Point'],
        required: true 
      },
      coordinates: {
        type: [Number], 
        required: true
      }
    },
  },
  {
    timestamps: true, 
  }
);

userSchema.index({ location: "2dsphere" });
const User = mongoose.model("User", userSchema);

export default User;
