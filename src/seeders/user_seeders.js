const mongoose = require("mongoose");
const { deleteMany, insertMany } = require("../models/user");
const dotenv = require("dotenv");
const logger = require("../config/winston");
dotenv.config();

const { connect, connection } = mongoose;

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to Mongoose");
  } catch (error) {
    logger.error("Connect to Mongoose failed:", error);
    process.exit(1);
  }
};

const users = [
  {
    email: "user1@gmail.com",
    name: "Nguyen Van A",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 5,
    address: "Hanoi",
  },
  {
    email: "user2@gmail.com",
    name: "Nguyen Van B",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 15,
    address: "Hanoi",
  },
  {
    email: "user3@gmail.com",
    name: "Nguyen Van C",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 25,
    address: "Hanoi",
  },
  {
    email: "admin@gmail.com",
    name: "Admin",
    role: "ADMIN",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0987654321",
    address: "Hanoi",
  },
];

const seedUsers = async () => {
  await connectDB();

  await deleteMany();

  await insertMany(users);
  logger.info("Insert events successfully");

  connection.close();
};

module.exports = seedUsers;