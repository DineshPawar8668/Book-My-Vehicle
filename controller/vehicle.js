import { getLocationName } from "../helper/location.js";
import { ErrorHandler } from "../middleware/errorHandler.js";
import User from "../models/user.js";
import Vehicle from "../models/vehicle.js";
import VehicleType from "../models/vehicleType.js";
import VehicleService from "../models/vehicleService.js";

// Create Vehicle
export const createVehicle = async (req, res, next) => {
  try {
    const {
      name,
      type,
      mainService,
      driver,
      seatingCapacity,
      location,
      perKmPrice,
    } = req.body;
    const { _id } = req.user;
    console.log(req.body);

    // Create a new Vehicle instance
    const newVehicle = new Vehicle({
      name,
      type,
      mainService,
      driver,
      seatingCapacity,
      location,
      perKmPrice,
      createdBy: _id,
      updatedBy: _id,
    });

    // Save the Vehicle to the database
    const savedVehicle = await newVehicle.save();

    return res.status(201).json({
      message: "Vehicle created successfully",
      data: savedVehicle,
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return next(
      new ErrorHandler("An error occurred while creating the vehicle", 500)
    );
  }
};

export const updateVehicle = async (req, res) => {
  const { id } = req.params; // Vehicle ID from the request parameters
  const updateData = req.body; // Data to update

  try {
    // Find the vehicle by ID and update with new data
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation during update
    });
    // .populate("type", "name")
    // .populate("mainService", "name")
    // .populate("driver", "name mobileNo");

    if (!updatedVehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return res.status(500).json({
      message: "An error occurred while updating the vehicle",
    });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ deleted: false });
    // .populate("type", "name")
    // .populate("mainService", "name")
    // .populate("driver", "name mobileNo");

    // Respond with the vehicle list
    return res.status(200).json({
      message: "Vehicle list fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicle list:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the vehicle list",
    });
  }
};

export const getVehiclesForUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const userData = await User.findById(req.user._id);

    // Ensure user latitude and longitude are converted to numbers
    const userLatitude = parseFloat(userData.location.coordinates[0]);
    const userLongitude = parseFloat(userData.location.coordinates[1]);

    // Validate if the coordinates are valid numbers
    if (isNaN(userLatitude) || isNaN(userLongitude)) {
      return res.status(400).json({
        message: "Invalid location data for the user",
      });
    }

    const vehicles = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [userLatitude, userLongitude],
          },
          distanceField: "distance",
          maxDistance: parseInt(req.query.distance) * 1000,
          spherical: true,
        },
      },
      {
        $match: {
          deleted: false,
          role: "VOwner",
          _id: { $nin: [_id] },
        },
      },
      {
        $addFields: {
          adjustedDistance: { $multiply: ["$distance", 1.3] }, // Approximate road distance
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "createdBy",
          as: "vehicle",
        },
      },
      {
        $unwind: {
          path: "$vehicle",
          // preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "vehicle.userDetails": {
            name: "$name",
            distance: "$distance",
          },
        },
      },
      {
        $project: {
          vehicle: "$vehicle",
        },
      },
    ]);

    // Respond with the vehicle list
    return res.status(200).json({
      message: "Vehicle list fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicle list:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the vehicle list",
    });
  }
};

export const getSingleVehicle = async (req, res) => {
  const { id } = req.params; // Vehicle ID from request parameters

  try {
    const vehicle = await Vehicle.findById(id)
      .populate("type", "name")
      .populate("mainService", "name")
      .populate("driver", "name mobileNo");

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the vehicle",
    });
  }
};

// Delete Vehicle
export const deleteVehicle = async (req, res) => {
  const { id } = req.params; // Vehicle ID from request parameters

  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the vehicle",
    });
  }
};

// type

export const createVehicleType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await VehicleType.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const newCategory = new VehicleType({ name, description });
    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get all vehicle type categories
export const getVehicleTypes = async (req, res) => {
  try {
    const categories = await VehicleType.find();
    return res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Get a single vehicle type category
export const getSingleVehicleType = async (req, res) => {
  try {
    const category = await VehicleType.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update a vehicle type category
export const updateVehicleType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await VehicleType.findByIdAndUpdate(
      req.params.id,
      { name, description, updatedAt: Date.now() },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete a vehicle type category
export const deleteVehicleType = async (req, res) => {
  try {
    const category = await VehicleType.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};





export const createVehicleService = async (serviceName, createdBy) => {
  try {
    const newService = new VehicleService({
      serviceName,
      createdBy,
    });
    await newService.save();
    return newService;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllVehicleServices = async () => {
  try {
    return await VehicleService.find({ deleted: false }).populate("createdBy", "name");
  } catch (error) {
    throw new Error("Error fetching vehicle services");
  }
};

export const getVehicleServiceById = async (id) => {
  try {
    const service = await VehicleService.findById(id).populate("createdBy", "name");
    if (!service || service.deleted) {
      throw new Error("Vehicle Service not found");
    }
    return service;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateVehicleService = async (id, serviceName, updatedBy) => {
  try {
    const service = await VehicleService.findById(id);
    if (!service || service.deleted) {
      throw new Error("Vehicle Service not found");
    }
    service.serviceName = serviceName || service.serviceName;
    service.updatedBy = updatedBy || service.updatedBy;
    await service.save();
    return service;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteVehicleService = async (id) => {
  try {
    const service = await VehicleService.findByIdAndUpdate(id, {
      deleted: true,
      active: false,
    });
    if (!service) {
      throw new Error("Vehicle Service not found");
    }
    return service;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const activateVehicleService = async (id) => {
  try {
    const service = await VehicleService.findByIdAndUpdate(id, {
      deleted: false,
      active: true,
    });
    if (!service) {
      throw new Error("Vehicle Service not found");
    }
    return service;
  } catch (error) {
    throw new Error(error.message);
  }
};
