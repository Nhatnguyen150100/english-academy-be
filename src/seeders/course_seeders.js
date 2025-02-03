const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../config/winston");
const { deleteMany, insertMany } = require("../models/courses");
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

const courses = [
  {
    name: "English Language Course",
    description: "An introductory course to the English language.",
  },
  {
    name: "Advanced Mathematics",
    description:
      "A comprehensive course covering advanced mathematical concepts.",
  },
  {
    name: "Web Development Bootcamp",
    description:
      "Learn to build websites from scratch using HTML, CSS, and JavaScript.",
  },
  {
    name: "Data Science with Python",
    description:
      "An in-depth course on data analysis and machine learning using Python.",
  },
  {
    name: "Introduction to Graphic Design",
    description:
      "Learn the fundamentals of graphic design and visual communication.",
  },
];

const seedCourses = async () => {
  await connectDB();

  await deleteMany();

  await insertMany(courses);

  connection.close();
};

module.exports = seedCourses;
