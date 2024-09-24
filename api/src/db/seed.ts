import { faker } from "@faker-js/faker";
import { hash } from "@node-rs/argon2";
import { User, Form, Field, Session, ShareLink } from "./models"; // Mongoose models
import mongoose from "mongoose";
import { connectToDatabase } from "./index";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890", 6); // Creates a 10-character unique ID
const shareIdGenerator = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

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

  console.log("Inserting new seed data...");

  const sampleUsers = [];
  for (let i = 0; i <= 10; i++) {
    const user = new User({
      _id: nanoid(),
      name: faker.person.fullName(),
      username: `user-${i}`,
      password_hash: await hash(`pass-${i}`),
    });
    await user.save(); // Save each user to the database
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
      userId: randomUser._id, // Reference by ObjectId
    });
    await form.save();

    const numFields = faker.number.int({ min: 2, max: 10 });
    for (let j = 0; j < numFields; j++) {
      const label = `Field ${j} Label`;

      // Randomly determine the field type and generate options if applicable
      const fieldType = faker.helpers.arrayElement([
        "text",
        "multiple_choice",
        "checkbox",
        "dropdown",
      ]);

      let options = undefined;
      if (
        fieldType === "multiple_choice" ||
        fieldType === "checkbox" ||
        fieldType === "dropdown"
      ) {
        options = Array.from(
          { length: faker.number.int({ min: 2, max: 5 }) },
          () => faker.word.noun(),
        );
      }

      const field = new Field({
        _id: Number(nanoid()),
        label, // Use label instead of front/back
        type: fieldType,
        required: faker.datatype.boolean(),
        options, // Only include options for applicable field types
        date: faker.date.recent({ days: 4.5 }),
        formId: form._id, // Reference by ObjectId
      });
      await field.save();

      // Update number of cards in the deck
      form.numberOfFields++;
    }
    await form.save(); // Save the updated deck with the correct card count
    // Create a share link for the form
    const shareLink = new ShareLink({
      formId: form._id, // Reference the form ID
      shareId: shareIdGenerator() // Generate unique share ID
    });
    await shareLink.save();
  }

  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    mongoose.connection.close(); // Close MongoDB connection
  });
