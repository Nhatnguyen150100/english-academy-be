const mongoose = require("mongoose");
const { deleteMany, insertMany, Exam } = require("../models/exam");
const dotenv = require("dotenv");
const logger = require("../config/winston");
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

const exams = (courseId) => ([
  {
    name: "English Exam 1",
    description: "Complete the sentences with the correct words.",
    timeExam: 60,
    level: "EASY",
    questions: [
      {
        content: "He ___ (be) a doctor for five years.",
        order: 1,
        options: [
          { content: "has been" },
          { content: "is" },
          { content: "was" },
        ],
        correctAnswer: "has been",
      },
      {
        content: "We ___ (have) a great time at the party.",
        order: 2,
        options: [{ content: "had" }, { content: "have" }, { content: "has" }],
        correctAnswer: "have",
      },
      {
        content: "She ___ (go) to the store every Saturday.",
        order: 3,
        options: [
          { content: "goes" },
          { content: "going" },
          { content: "gone" },
        ],
        correctAnswer: "goes",
      },
      {
        content: "They ___ (play) basketball after school.",
        order: 4,
        options: [
          { content: "plays" },
          { content: "playing" },
          { content: "play" },
        ],
        correctAnswer: "play",
      },
      {
        content: "I ___ (want) to travel the world.",
        order: 5,
        options: [
          { content: "want" },
          { content: "wants" },
          { content: "wanting" },
        ],
        correctAnswer: "want",
      },
    ],
    courseId,
  },
  {
    name: "English Exam 2",
    description: "Complete the sentences with the correct words.",
    timeExam: 45,
    level: "MEDIUM",
    questions: [
      {
        content: "She ___ (be) a great singer.",
        order: 1,
        options: [
          { content: "is" },
          { content: "was" },
          { content: "will be" },
        ],
        correctAnswer: "is",
      },
      {
        content: "They ___ (go) to the movies every Friday.",
        order: 2,
        options: [{ content: "go" }, { content: "goes" }, { content: "going" }],
        correctAnswer: "go",
      },
      {
        content: "He ___ (study) for his exams.",
        order: 3,
        options: [
          { content: "studies" },
          { content: "study" },
          { content: "studying" },
        ],
        correctAnswer: "studies",
      },
      {
        content: "We ___ (have) dinner at 7 PM.",
        order: 4,
        options: [{ content: "have" }, { content: "has" }, { content: "had" }],
        correctAnswer: "have",
      },
      {
        content: "I ___ (read) an interesting book.",
        order: 5,
        options: [
          { content: "read" },
          { content: "reads" },
          { content: "reading" },
        ],
        correctAnswer: "read",
      },
    ],
    courseId,
  },
]);

const seedExams = async () => {
  await connectDB();

  await deleteMany();

  const courses = await Course.find();

  await insertMany(exams(courses[0]._id));

  const examsData = await Exam.find();

  await Course.findByIdAndUpdate(courses[0]._id, ({...courses[0].toObject(), exams: examsData.map((item) => item._id)}), {
    new: true,
  });

  connection.close();
};

module.exports = seedExams;
