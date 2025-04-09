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
    isRequestChangeToPremium: true,
  },
  {
    email: "user3@gmail.com",
    name: "Nguyen Van C",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 25,
    address: "Hanoi",
    isRequestChangeToPremium: true,
  },
  {
    email: "user4@gmail.com",
    name: "Nguyen Van D",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 25,
    address: "Hanoi",
  },
  {
    email: "user5@gmail.com",
    name: "Nguyen Van E",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 25,
    address: "Hanoi",
    isRequestChangeToPremium: true,
  },
  {
    email: "user6@gmail.com",
    name: "Nguyen Van F",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 15,
    address: "Hanoi",
    isRequestChangeToPremium: true,
  },
  {
    email: "user7@gmail.com",
    name: "Nguyen Van G",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 35,
    address: "Hanoi",
  },
  {
    email: "user8@gmail.com",
    name: "Nguyen Van H",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 25,
    address: "Hanoi",
    isRequestChangeToPremium: true,
  },
  {
    email: "user9@gmail.com",
    name: "Nguyen Van I",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 65,
    address: "Hanoi",
  },
  {
    email: "user10@gmail.com",
    name: "Nguyen Van K",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 95,
    address: "Hanoi",
  },
  {
    email: "user11@gmail.com",
    name: "Nguyen Van K",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 165,
    address: "Hanoi",
  },
  {
    email: "user12@gmail.com",
    name: "Nguyen Van L",
    role: "USER",
    password: "$2b$10$6eXQVPv8SBbKvivehAXVWe/lotzezRfMWZ3oc82vfxHUYZnKp0gVG", // plain = password
    phone_number: "0123456789",
    score: 35,
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
