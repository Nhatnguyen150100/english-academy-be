const mongoose = require("mongoose");
const { deleteMany, insertMany } = require("../models/exam");
const dotenv = require("dotenv");
const logger = require("../config/winston");
const { Chapter } = require("../models/chapter");
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

const generateExams = (chapterIds) => [
  {
    name: "English Exam 1",
    description: "Complete the sentences with the correct words.",
    timeExam: 60,
    level: "EASY",
    chapterId: chapterIds[0],
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
  },
  {
    name: "English Exam 2",
    description: "Complete the sentences with the correct words.",
    timeExam: 45,
    level: "MEDIUM",
    chapterId: chapterIds[1],
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
  },
];

const seedExams = async () => {
  await connectDB();

  try {
    await deleteMany();

    const chapters = await Chapter.find().sort({ order: 1 });
    if (chapters.length < 2) {
      throw new Error("Need at least 2 chapters to seed exams");
    }

    const examsData = generateExams(chapters.map((c) => c._id));
    const exams = await insertMany(examsData);

    for (const chapter of chapters) {
      const chapterExams = exams.filter((e) => e.chapterId.equals(chapter._id));
      await Chapter.findByIdAndUpdate(
        chapter._id,
        { $set: { exams: chapterExams.map((e) => e._id) } },
        { new: true },
      );
    }

    logger.info(`Seeded ${exams.length} exams successfully`);
  } catch (error) {
    logger.error("Error seeding exams:", error);
  } finally {
    connection.close();
  }
};

module.exports = seedExams;
