const express = require('express');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Disable x-powered-by header for security
app.disable('x-powered-by');

// Parse JSON request bodies
app.use(express.json());

// Root endpoint: confirms the API is running (FR-01)
app.get('/', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "DecodeLabs User Management API (Express.js) is running",
    framework: "Express.js",
    version: "1.0.0",
  });
});

// User routes
app.use('/users', userRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;

