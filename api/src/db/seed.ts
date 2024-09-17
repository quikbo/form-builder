import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";
import { User, Form, Field, Session } from "./models";  // Mongoose models
import mongoose from "mongoose";
import { connectToDatabase } from "./index";
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890', 6);  // Creates a 10-character unique ID


async function seed() {
  console.log("Connecting to the database...");
  await connectToDatabase();
  console.log("Seeding the database...");

  console.log("Cleaning existing data...");
  await Field.deleteMany({});
  await Form.deleteMany({});
  await User.deleteMany({});
  await Session.deleteMany({});

  console.log("Inserting new seed data...");

  const sampleUsers = [];
  for (let i = 0; i <= 10; i++) {
    const user = new User({
      _id: nanoid(),
      name: faker.person.fullName(),
      username: `user-${i}`,
      password_hash: await hash(`pass-${i}`),
    });
    await user.save();  // Save each user to the database
    sampleUsers.push(user);
  }

  let numForms = 100;
  for (let i = 1; i <= numForms; i++) {
    const title = `Form ${i}`;
    const randomUser = faker.helpers.arrayElement(sampleUsers);

    const form = new Form({
      _id: Number(nanoid()),
      title,
      numberOfFields: 0,
      date: faker.date.recent({ days: 5 }),
      userId: randomUser._id,  // Reference by ObjectId
    });
    await form.save();

    const numFields = faker.number.int({ min: 2, max: 10 });
    for (let j = 0; j < numFields; j++) {
      const front = `Field ${j} Front `;
      const back = `Back`;

      const field = new Field({
        _id: Number(nanoid()),
        front,
        back,
        date: faker.date.recent({ days: 4.5 }),
        formId: form._id,  // Reference by ObjectId
      });
      await field.save();

      // Update number of cards in the deck
      form.numberOfFields++;
    }
    await form.save();  // Save the updated deck with the correct card count
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

