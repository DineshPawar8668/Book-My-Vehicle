import { getLocationName } from "../helper/location.js";
import { ErrorHandler } from "../middleware/errorHandler.js";
import User from "../models/user.js";
import Vehicle from "../models/vehicle.js";
import VehicleType from "../models/vehicleType.js";
import VehicleService from "../models/vehicleService.js";
import { statusCode } from "../config.js/statusCode.js";
import { handleError } from "../helper/handleError.js";

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

    return res.status(statusCode.OK).json({
      message: "Vehicle created successfully",
      data: savedVehicle,
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return handleError(error, res, next);
  }
};

// Update Vehicle
export const updateVehicle = async (req, res, next) => {
  const { id } = req.params; // Vehicle ID from the request parameters
  const updateData = req.body; // Data to update

  try {
    // Find the vehicle by ID and update with new data
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation during update
    });

    if (!updatedVehicle) {
      return res.status(statusCode.NOT_FOUND).json({
        message: "Vehicle not found",
      });
    }

    return res.status(statusCode.OK).json({
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return handleError(error, res, next);
  }
};

// Get All Vehicles
export const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ deleted: false });

    return res.status(statusCode.OK).json({
      message: "Vehicle list fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicle list:", error);
    return handleError(error, res, next);
  }
};

// Get Vehicles for User
export const getVehiclesForUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const userData = await User.findById(req.user._id);

    const userLatitude = parseFloat(userData.location.coordinates[0]);
    const userLongitude = parseFloat(userData.location.coordinates[1]);

    if (isNaN(userLatitude) || isNaN(userLongitude)) {
      return res.status(statusCode.BAD_REQUEST).json({
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
          maxDistance: parseInt(30) * 1000,
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
          adjustedDistance: { $multiply: ["$distance", 1.3] },
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

    return res.status(statusCode.OK).json({
      message: "Vehicle list fetched successfully",
      data: vehicles,
    });
  } catch (error) {
    console.error("Error fetching vehicle list:", error);
    return handleError(error, res, next);
  }
};

// Get Single Vehicle
export const getSingleVehicle = async (req, res, next) => {
  const { id } = req.params; // Vehicle ID from request parameters

  try {
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(statusCode.NOT_FOUND).json({
        message: "Vehicle not found",
      });
    }

    return res.status(statusCode.OK).json({
      message: "Vehicle fetched successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return handleError(error, res, next);
  }
};

export const deleteVehicle = async (req, res, next) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!vehicle) {
      return next(new ErrorHandler("Vehicle not found", statusCode.NOT_FOUND));
    }

    return res.status(statusCode.OK).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const createVehicleType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { _id } = req.user;

    const existingCategory = await VehixcleType.findOne({
      name,
    });

    if (existingCategory) {
      throw new ErrorHandler(
        "Category already exists.",
        statusCode.BAD_REQUEST
      );
    }
    const newCategory = new VehicleType({
      name,
      createdBy: _id,
      updatedBy: _id,
    });
    
    await newCategory.save();

    return res.status(statusCode.CREATED).json(newCategory);
  } catch (error) {
    console.log(error);
    return handleError(error, res, next);
  }
};

export const getVehicleTypes = async (req, res, next) => {
  try {
    const categories = await VehicleType.find();
    return res
      .status(statusCode.OK)
      .json({ message: "List fetch successfully.", data: categories });
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const getSingleVehicleType = async (req, res, next) => {
  try {
    const category = await VehicleType.findById(req.params.id);
    if (!category) {
      return next(new ErrorHandler("Category not found", statusCode.NOT_FOUND));
    }

    return res.status(statusCode.OK).json(category);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const updateVehicleType = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await VehicleType.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!category) {
      return next(new ErrorHandler("Category not found", statusCode.NOT_FOUND));
    }

    return res.status(statusCode.OK).json(category);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const deleteVehicleType = async (req, res, next) => {
  try {
    const category = await VehicleType.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!category) {
      return next(new ErrorHandler("Category not found", statusCode.NOT_FOUND));
    }

    return res
      .status(statusCode.OK)
      .json({ message: "Category deleted successfully" });
  } catch (error) {
    return handleError(error, res, next);
  }
};
export const createVehicleService = async (req, res, next) => {
  const { serviceName, createdBy } = req.body;
  try {
    const newService = new VehicleService({
      serviceName,
      createdBy,
    });
    await newService.save();
    return res.status(statusCode.CREATED).json({
      message: "Vehicle service created successfully",
      data: newService,
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const getAllVehicleServices = async (req, res, next) => {
  try {
    const services = await VehicleService.find({ deleted: false }).populate(
      "createdBy",
      "name"
    );
    return res.status(statusCode.OK).json(services);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const getVehicleServiceById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const service = await VehicleService.findById(id).populate(
      "createdBy",
      "name"
    );
    if (!service || service.deleted) {
      return next(
        new ErrorHandler("Vehicle service not found", statusCode.NOT_FOUND)
      );
    }
    return res.status(statusCode.OK).json(service);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const updateVehicleService = async (req, res, next) => {
  const { id } = req.params;
  const { serviceName, updatedBy } = req.body;
  try {
    const service = await VehicleService.findById(id);
    if (!service || service.deleted) {
      return next(
        new ErrorHandler("Vehicle service not found", statusCode.NOT_FOUND)
      );
    }
    service.serviceName = serviceName || service.serviceName;
    service.updatedBy = updatedBy || service.updatedBy;
    await service.save();
    return res.status(statusCode.OK).json({
      message: "Vehicle service updated successfully",
      data: service,
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const deleteVehicleService = async (req, res, next) => {
  const { id } = req.params;
  try {
    const service = await VehicleService.findByIdAndUpdate(id, {
      deleted: true,
      active: false,
    });
    if (!service) {
      return next(
        new ErrorHandler("Vehicle service not found", statusCode.NOT_FOUND)
      );
    }
    return res.status(statusCode.OK).json({
      message: "Vehicle service deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const activateVehicleService = async (req, res, next) => {
  const { id } = req.params;
  try {
    const service = await VehicleService.findByIdAndUpdate(id, {
      deleted: false,
      active: true,
    });
    if (!service) {
      return next(
        new ErrorHandler("Vehicle service not found", statusCode.NOT_FOUND)
      );
    }
    return res.status(statusCode.OK).json({
      message: "Vehicle service activated successfully",
    });
  } catch (error) {
    return handleError(error, res, next);
  }
};
