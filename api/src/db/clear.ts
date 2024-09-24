
import { User, Form, Field, Session, ShareLink, Response } from "./models"; // Mongoose models
import mongoose from "mongoose";
import { connectToDatabase } from "./index";

async function seed() {
  console.log("Connecting to the database...");
  await connectToDatabase();
  console.log("Seeding the database...");

  console.log("Cleaning existing data...");
  await Field.deleteMany({});
  await Form.deleteMany({});
  await User.deleteMany({});
  await Session.deleteMany({});
  await ShareLink.deleteMany({});
  await Response.deleteMany({});
  console.log("Cleaned successfully");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    mongoose.connection.close(); // Close MongoDB connection
  });
