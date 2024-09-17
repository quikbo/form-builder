import mongoose from "mongoose";

// Form Schema
const formSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  numberOfFields: { type: Number, required: true },
  date: { type: Date, default: Date.now }, // Date object in MongoDB
  userId: { type: String, ref: "User", required: true }, // Reference to User
});

// Field Schema
const fieldSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  label: { type: String, required: true }, // Represents the question label
  type: {
    type: String,
    required: true,
    enum: ["text", "multiple_choice", "checkbox", "dropdown"], // Limit the type to specific values
  }, // Defines the type of field
  options: [{ type: String }], // Optional, used for multiple choice, checkbox, or dropdown
  required: { type: Boolean, default: false }, // Specifies if the field is required
  date: { type: Date, default: Date.now },
  formId: { type: Number, ref: "Form", required: true }, // Reference to Deck
});

// User Schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true }, // renamed to match Mongo style
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Keep as string for Lucia Auth
  userId: { type: String, ref: "User", required: true },
  expiresAt: { type: Date, required: true }, // Use Date for expiration time
});

// Export Models
export const User = mongoose.model("User", userSchema);
export const Form = mongoose.model("Form", formSchema);
export const Field = mongoose.model("Field", fieldSchema);
export const Session = mongoose.model("Session", sessionSchema);
