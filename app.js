import express from 'express';
import router from "./routes/index.js";
import morgan from 'morgan'; // Import morgan for logging
import { handleGlobleError } from './middleware/errorHandler.js';
import { db } from './config.js/dataBase.js';
import dotenv from 'dotenv';

const app = express();

// Middleware to parse JSON
app.use(express.json());
dotenv.config(); // Load environment variables from the .env file

// logs for http req
app.use(morgan('dev')); 
// database:
db();

// Mount routes
app.use("/api",router);

// Error handler:
app.use(handleGlobleError);

// Define the port
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
