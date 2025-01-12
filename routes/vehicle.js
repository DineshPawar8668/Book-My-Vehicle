import express from "express";
import {
  adminAuthentication,
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
  deleteVehicleType
} from "../controller/vehicle.js";
const router = express.Router();

// Vehicle Creation:
router.get("/list/v1", vOwnerAuthentication, getVehicles);
router.post("/create/v1", vOwnerAuthentication, createVehicle);
router.put("/update/:id/v1", vOwnerAuthentication, updateVehicle);
router.get("/single/:id/v1", vOwnerAuthentication, getSingleVehicle);
router.put("/delete/:id/v1", vOwnerAuthentication, deleteVehicle);

// Vehicle Category:
router.get("/category/list/v1", adminAuthentication, getVehicleTypes); // List all vehicle types
router.post("/category/create/v1", adminAuthentication, createVehicleType); // Create a new vehicle type
router.get(
  "/category/single/:id/v1",
  adminAuthentication,
  getSingleVehicleType
); // Get a single vehicle type by ID
router.put("/category/update/:id/v1", adminAuthentication, updateVehicleType); // Update a vehicle type
router.put("/category/delete/:id/v1", adminAuthentication, deleteVehicleType); // Delete a vehicle type

// vehicle service:
// router.get("/list/v1", vOwnerAuthentication, getAllVehicleServices);
// router.get("/single/:id/v1", vOwnerAuthentication, getVehicleServiceById);
// router.post("/create/v1", vOwnerAuthentication, createVehicleService);
// router.put("/update/:id/v1", vOwnerAuthentication, updateVehicleService);
// router.put("/delete/:id/v1", vOwnerAuthentication, deleteVehicleService);
// router.put("/activate/:id/v1", vOwnerAuthentication, activateVehicleService);

// User:
router.get("/user/list/v1", userAuthentication, getVehiclesForUser);

export default router;
