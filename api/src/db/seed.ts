import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";
import { User, Deck, Card, Session } from "./models";  // Mongoose models
import mongoose from "mongoose";
import { connectToDatabase } from "./index";

async function seed() {
  console.log("Connecting to the database...");
  await connectToDatabase();
  console.log("Seeding the database...");

  console.log("Cleaning existing data...");
  await Card.deleteMany({});
  await Deck.deleteMany({});
  await User.deleteMany({});
  await Session.deleteMany({});

  console.log("Inserting new seed data...");

  const sampleKeywords = [
    "technology",
    "innovation",
    "design",
    "development",
    "programming",
    "software",
    "hardware",
    "AI",
    "machine learning",
    "data science",
    "cloud computing",
    "cybersecurity",
  ];

  const sampleUsers = [];
  for (let i = 0; i <= 10; i++) {
    const user = new User({
      _id: `id-${i}`,
      name: faker.person.fullName(),
      username: `user-${i}`,
      password_hash: await hash(`pass-${i}`),
    });
    await user.save();  // Save each user to the database
    sampleUsers.push(user);
  }

  let numDecks = 100;
  for (let i = 1; i <= numDecks; i++) {
    const randomKeywords = faker.helpers.arrayElements(sampleKeywords, {
      min: 1,
      max: 3,
    });
    const title = `Deck ${i} ${randomKeywords.join(" ")} `;
    const randomUser = faker.helpers.arrayElement(sampleUsers);

    const deck = new Deck({
      title,
      numberOfCards: 0,
      date: faker.date.recent({ days: 5 }),
      userId: randomUser._id,  // Reference by ObjectId
    });
    await deck.save();

    const numCards = faker.number.int({ min: 3, max: 25 });
    for (let j = 0; j < numCards; j++) {
      const randomKeywords = faker.helpers.arrayElements(sampleKeywords, {
        min: 1,
        max: 3,
      });
      const front = `Card ${j} Front ${randomKeywords.join(" ")}`;
      const back = `Back ${randomKeywords.join(" ")}`;

      const card = new Card({
        front,
        back,
        date: faker.date.recent({ days: 4.5 }),
        deckId: deck._id,  // Reference by ObjectId
      });
      await card.save();

      // Update number of cards in the deck
      deck.numberOfCards++;
    }
    await deck.save();  // Save the updated deck with the correct card count
  }

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    mongoose.connection.close();  // Close MongoDB connection
  });

