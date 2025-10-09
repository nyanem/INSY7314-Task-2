import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Attempting to connect to MongoDB...");
    
    const conn = await mongoose.connect(MONGODB_URI, {
      // These options help with connection stability
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    
    // If it's a network error, provide helpful debugging info
    if (error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
      console.error("Network connection failed. Please check:");
      console.error("1. Your internet connection");
      console.error("2. MongoDB Atlas cluster is running");
      console.error("3. Your IP address is whitelisted in MongoDB Atlas");
    }
    
    // If it's an authentication error
    if (error.message.includes("Authentication failed")) {
      console.error("Authentication failed. Please check:");
      console.error("1. Username and password in MONGODB_URI are correct");
      console.error("2. Database user has proper permissions");
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Handle app termination
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed through app termination");
  process.exit(0);
});

export default connectDB;
