// models/vehicleType.js
import mongoose from 'mongoose';

const vehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const VehicleType = mongoose.model('VehicleType', vehicleTypeSchema);
export default VehicleType;
