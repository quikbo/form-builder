import { eq, sql } from "drizzle-orm";
import { db, connection } from "./index";
import { decks, cards, users, sessions } from "./schema";
import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";
import { hashOptions } from "../routes/auth";

async function seed() {
  console.log("Seeding the database...");

  console.log("Cleaning existing data...");
  await db.delete(cards);
  await db.delete(decks);
  await db.delete(users);
  await db.delete(sessions);
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('decks')`);
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('cards')`);
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('users')`);
  await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('sessions')`);

  console.log("Inserting new seed data...");

  //inserting 50 decks with randomized fake titles and a random amount of cards
  //with fake front and back data, these sample keywords are here to test
  //search query parameter
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
    const user = await db
      .insert(users)
      .values({
        name: faker.person.fullName(),
        username: `user-${i}`,
        password_hash: await hash(`pass-${i}`, hashOptions),
      })
      .returning()
      .get();

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

    const deck = await db
      .insert(decks)
      .values({
        title,
        numberOfCards: 0,
        date: faker.date.recent({
          days: 5,
        }),
        userId: randomUser.id,
      })
      .returning()
      .get();

    //adding cards to every deck
    const numCards = faker.number.int({ min: 3, max: 25 });
    for (let j = 0; j < numCards; j++) {
      const randomKeywords = faker.helpers.arrayElements(sampleKeywords, {
        min: 1,
        max: 3,
      });
      const front = `Card ${j} Front ${randomKeywords.join(" ")}`;
      const back = `Back ${randomKeywords.join(" ")}`;

      await db.insert(cards).values({
        front,
        back,
        date: faker.date.recent({
          days: 4.5,
        }),
        deckId: deck.id,
      });
      await db
        .update(decks)
        .set({ numberOfCards: ++deck.numberOfCards })
        .where(eq(decks.id, deck.id))
        .returning()
        .get();
    }
  }

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });
