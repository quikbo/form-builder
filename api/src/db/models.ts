import mongoose from "mongoose";

// Deck Schema
const deckSchema = new mongoose.Schema({
  title: { type: String, required: true },
  numberOfCards: { type: Number, required: true },
  date: { type: Date, default: Date.now },  // Date object in MongoDB
  userId: { type: String, ref: 'User', required: true },  // Reference to User
});

// Card Schema
const cardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  date: { type: Date, default: Date.now },
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },  // Reference to Deck
});

// User Schema
const userSchema = new mongoose.Schema({
  _id: {type : String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },  // renamed to match Mongo style
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Keep as string for Lucia Auth
  userId: { type: String, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },  // Use Date for expiration time
});

// Export Models
export const User = mongoose.model('User', userSchema);
export const Deck = mongoose.model('Deck', deckSchema);
export const Card = mongoose.model('Card', cardSchema);
export const Session = mongoose.model('Session', sessionSchema);


