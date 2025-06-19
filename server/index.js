require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const allRoutes = require('./routes'); // Will point to routes/index.js
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Basic route for server status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount all routes from routes/index.js under /api
app.use('/api', allRoutes);

// Custom Middleware for 404 Not Found errors
app.use(notFound);

// Custom Error Handler Middleware
// This should be the last piece of middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
