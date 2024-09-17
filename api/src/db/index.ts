import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const DATABASE_URL = process.env.MONGODB_URL!;

export const connectToDatabase = async () => {
  try {
    console.log(DATABASE_URL);
    await mongoose.connect(DATABASE_URL);
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Call the connection function wherever necessary to connect to the database
