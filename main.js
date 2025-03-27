require("dotenv").config(); // Load .env first
const express = require("express");
const connectDB = require("./db"); // Import MongoDB connection
const basicRoutes = require("./routes/basic"); // Import routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); 



// Use routes
app.use("/", basicRoutes);

const startServer = async () => {
    await connectDB(); // Connect to MongoDB **only once**
  
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
};

// Start the server
startServer();
