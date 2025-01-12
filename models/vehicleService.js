import mongoose from "mongoose";

const vehicleServiceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,  // For example: "Wedding," "Maintenance," "Repair"
      enum: ["Wedding", "Maintenance", "Repair", "Inspection"], // Add more options if needed
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const VehicleService = mongoose.model("VehicleService", vehicleServiceSchema);

export default VehicleService;
