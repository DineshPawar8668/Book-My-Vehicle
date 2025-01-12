import mongoose from "mongoose";

export const db = () =>
  mongoose
    .connect("mongodb://localhost:27017/vehicle_app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB", err));
