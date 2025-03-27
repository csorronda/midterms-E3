const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("⚠️ MONGO_URI is missing in .env file!");
    }

    await mongoose.connect(process.env.MONGO_URI); // No extra options needed

    console.log("MongoDB Connected Successfully");
    
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
