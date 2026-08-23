require("dotenv").config();

const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");

const connectDB = require("./config/db");

const candidateRoutes = require("./routes/candidateRoutes");
const rayRoutes = require("./routes/rayRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

//Resume Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/ray", rayRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Smart Resume Screener API is running!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});