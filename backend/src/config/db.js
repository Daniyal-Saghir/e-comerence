const mongoose = require('mongoose');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Options are no longer needed in Mongoose 6+, but good practice to ensure compatibility
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
