// models/vehicleType.js
import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const vehicleTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: ObjectId,
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const VehicleType = mongoose.model("VehicleType", vehicleTypeSchema);
export default VehicleType;
