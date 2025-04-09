const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../config/winston");
const { deleteMany, insertMany } = require("../models/chapter");
const { Course } = require("../models/courses");
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

const chapters = (course) => [
  {
    title: "Chapter 1: Basic Grammar",
    description: "Introduction to basic English grammar",
    courseId: course._id,
    order: 1,
  },
  {
    title: "Chapter 2: Intermediate Grammar",
    description: "Intermediate level grammar exercises",
    courseId: course._id,
    order: 2,
  },
  {
    title: "Chapter 3: Intermediate Grammar 2",
    description: "Intermediate level grammar exercises",
    courseId: course._id,
    order: 3,
  },
  {
    title: "Chapter 4: Intermediate Grammar 2",
    description: "Intermediate level grammar exercises",
    courseId: course._id,
    order: 4,
  },
  {
    title: "Chapter 5: Intermediate Grammar 2",
    description: "Intermediate level grammar exercises",
    courseId: course._id,
    order: 5,
  },
  {
    title: "Chapter 6: Intermediate Grammar 2",
    description: "Intermediate level grammar exercises",
    courseId: course._id,
    order: 6,
  },
  {
    title: "Chapter 7: Intermediate Grammar 2",
    description: "Intermediate level grammar exercises",
    courseId: course._id,
    order: 7,
  },
];

const seedChapters = async () => {
  await connectDB();

  try {
    await deleteMany();
    const course = await Course.findOne();
    if (!course) {
      throw new Error("No courses found");
    }
    const data = await insertMany(chapters(course));
    await Course.findByIdAndUpdate(
      course._id,
      { $set: { chapters: data.map((c) => c._id) } },
      { new: true },
    );
    logger.info(`Seeded ${data.length} chapters successfully`);
  } catch (error) {
    logger.error("Error seeding chapters:", error);
  } finally {
    connection.close();
  }
};

module.exports = seedChapters;
