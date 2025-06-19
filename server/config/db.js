const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database.
 * Uses the MONGODB_URI from environment variables.
 * Exits the process with failure (1) if the connection fails.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,      // Use the new URL string parser
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
      // useCreateIndex: true,    // No longer needed in Mongoose 6+
      // useFindAndModify: false, // No longer needed in Mongoose 6+
    });
    console.log('MongoDB Connected Successfully...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with a failure code if connection to DB fails
    process.exit(1);
  }
};

module.exports = connectDB;
