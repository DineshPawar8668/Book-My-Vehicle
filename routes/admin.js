import express from "express";
const router = express.Router(); 

// Define the route
router.get("/list/v1", (req, res) => {
  res.json({
    message: "data get",
  });
});

export default router;


// import express from "express";

// export const router = express.Router();

// router.get("/list/v1", (req, res) => {
//   res.json({
//     message: "data get",
//   });
// });
