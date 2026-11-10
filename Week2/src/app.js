const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Health / Status
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'DecodeLabs Backend Development - Project 2: Database Integration (CRUD) API',
    endpoints: {
      users: '/users'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User Routes
app.use('/users', userRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

