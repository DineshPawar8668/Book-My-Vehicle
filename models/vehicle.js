import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    type: {
      type: ObjectId,
      ref: "VehicleType", // Reference to the VehicleType model
    },
    mainService: {
      type: ObjectId,
      ref: "Service", // Reference to the Service model
    },
    driver: {
      type: ObjectId,
      ref: "Driver", // Reference to the Driver model
    },
    seatingCapacity: {
      type: Number,
      min: 1,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Ensures the type is "Point"
        required: true,
      },
      coordinates: {
        type: [Number], // Array of numbers for [longitude, latitude]
        required: true,
      },
    },
    perKmPrice: {
      type: Number,
      min: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
vehicleSchema.index({ location: "2dsphere" });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
