import express from "express";
import {
  userAuthentication,
  vOwnerAuthentication,
} from "./../middleware/authentication.js";
import {
  createVehicle,
  deleteVehicle,
  getSingleVehicle,
  getVehicles,
  getVehiclesForUser,
  updateVehicle,
  createVehicleType,
  getVehicleTypes,
  getSingleVehicleType,
  updateVehicleType,
  deleteVehicleType,
  createVehicleService,
  getAllVehicleServices,
  getVehicleServiceById,
  updateVehicleService,
  deleteVehicleService,
  activateVehicleService,
} from "../controller/vehicle.js";
const router = express.Router();

// Define the route
router.get("/user/list/v1", userAuthentication, getVehiclesForUser);
router.get("/list/v1", vOwnerAuthentication, getVehicles);
router.post("/create/v1", vOwnerAuthentication, createVehicle);
router.put("/update/:id/v1", vOwnerAuthentication, updateVehicle);
router.get("/single/:id/v1", vOwnerAuthentication, getSingleVehicle);
router.put("/delete/:id/v1", vOwnerAuthentication, deleteVehicle);

// Vehicle Type Routes
router.get("/list/v1", vOwnerAuthentication, getVehicleTypes); // List all vehicle types
router.post("/create/v1", vOwnerAuthentication, createVehicleType); // Create a new vehicle type
router.get("/single/:id/v1", vOwnerAuthentication, getSingleVehicleType); // Get a single vehicle type by ID
router.put("/update/:id/v1", vOwnerAuthentication, updateVehicleType); // Update a vehicle type
router.delete("/delete/:id/v1", vOwnerAuthentication, deleteVehicleType); // Delete a vehicle type

// vehicle service:
router.get("/list/v1", vOwnerAuthentication, getAllVehicleServices);
router.get("/single/:id/v1", vOwnerAuthentication, getVehicleServiceById);
router.post("/create/v1", vOwnerAuthentication, createVehicleService);
router.put("/update/:id/v1", vOwnerAuthentication, updateVehicleService);
router.put("/delete/:id/v1", vOwnerAuthentication, deleteVehicleService);
router.put("/activate/:id/v1", vOwnerAuthentication, activateVehicleService);

export default router;
