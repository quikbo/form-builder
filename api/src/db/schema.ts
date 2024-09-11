import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

//TABLE OF DECKS
export const decks = sqliteTable("decks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  numberOfCards: integer("numberOfCards").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

//TABLE OF CARDS: EACH CARD REFERENCES A SPECIFIC DECK
export const cards = sqliteTable("cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  deckId: integer("deck_id")
    .notNull()
    .references(() => decks.id, { onDelete: "cascade" }),
});

//USER TABLE
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password_hash: text("password").notNull(),
});

//SESSIONS TABLE
export const sessions = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(), // must be a string for Lucia Auth
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});
