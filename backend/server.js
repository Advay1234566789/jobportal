const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./middleware/passportConfig");
const cors = require("cors");
require("dotenv").config();

const initRouter = require("./routes");
const jobSearchAPI = require("./routes/jobSearchAPI");  // Import the new job search API


mongoose
  .connect(
    "mongodb+srv://nhatkha06299:nhatkha@datacluster.0yp5pys.mongodb.net/JobPotal"
  )
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error(err));

// Create an Express application, set port for server
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Initialize routes
initRouter(app);

// Use job search API route (this could be under /api/jobs path)
app.use("/api/jobs", jobSearchAPI);  // Attach the job search API route here

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
