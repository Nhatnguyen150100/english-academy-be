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

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateExams = (chapterIds) => [
  {
    name: "Sentence Arrangement Test 1",
    description: "Basic sentence structure exam",
    timeExam: 45,
    level: "EASY",
    chapterId: chapterIds[0],
    questions: [
      // ============ MCQ Questions =============
      {
        type: "MCQ",
        content: "Select correct verb form:",
        order: 1,
        options: [{ content: "go" }, { content: "goes" }, { content: "going" }],
        correctAnswer: "goes",
      },
      {
        type: "MCQ",
        content: "Choose proper pronoun:",
        order: 2,
        options: [{ content: "we" }, { content: "us" }, { content: "our" }],
        correctAnswer: "we",
      },
      // ============ ARRANGE Questions =============
      {
        type: "ARRANGE",
        content: "Arrange to make a complete sentence:",
        order: 3,
        correctAnswer: [
          "she",
          "is",
          "going",
          "to",
          "the",
          "concert",
          "tonight",
          ".",
        ],
        options: shuffleArray([
          { content: "going" },
          { content: "tonight" },
          { content: "the" },
          { content: "she" },
          { content: "is" },
          { content: "to" },
          { content: "concert" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Form a question:",
        order: 4,
        correctAnswer: ["have", "you", "finished", "your", "homework", "?"],
        options: shuffleArray([
          { content: "your" },
          { content: "have" },
          { content: "finished" },
          { content: "homework" },
          { content: "you" },
          { content: "?" },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Create proper sentence:",
        order: 5,
        correctAnswer: [
          "the",
          "quick",
          "brown",
          "fox",
          "jumps",
          "over",
          "the",
          "lazy",
          "dog",
          ".",
        ],
        options: shuffleArray([
          { content: "dog" },
          { content: "over" },
          { content: "the" },
          { content: "lazy" },
          { content: "quick" },
          { content: "brown" },
          { content: "fox" },
          { content: "jumps" },
          { content: "the" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Arrange words correctly:",
        order: 6,
        correctAnswer: ["i", "am", "reading", "an", "interesting", "book", "."],
        options: shuffleArray([
          { content: "book" },
          { content: "reading" },
          { content: "i" },
          { content: "an" },
          { content: "am" },
          { content: "interesting" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Form complete sentence:",
        order: 7,
        correctAnswer: ["they", "went", "to", "the", "beach", "yesterday", "."],
        options: shuffleArray([
          { content: "beach" },
          { content: "yesterday" },
          { content: "to" },
          { content: "they" },
          { content: "the" },
          { content: "went" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Arrange to make proper order:",
        order: 8,
        correctAnswer: [
          "i",
          "have",
          "never",
          "seen",
          "such",
          "a",
          "beautiful",
          "sunset",
          ".",
        ],
        options: shuffleArray([
          { content: "sunset" },
          { content: "never" },
          { content: "i" },
          { content: "have" },
          { content: "such" },
          { content: "a" },
          { content: "beautiful" },
          { content: "seen" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Create meaningful sentence:",
        order: 9,
        correctAnswer: [
          "we",
          "should",
          "recycle",
          "to",
          "protect",
          "the",
          "environment",
          ".",
        ],
        options: shuffleArray([
          { content: "protect" },
          { content: "environment" },
          { content: "we" },
          { content: "should" },
          { content: "recycle" },
          { content: "to" },
          { content: "the" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Arrange words properly:",
        order: 10,
        correctAnswer: ["the", "meeting", "starts", "at", "3", "pm", "."],
        options: shuffleArray([
          { content: "starts" },
          { content: "pm" },
          { content: "the" },
          { content: "at" },
          { content: "3" },
          { content: "meeting" },
          { content: "." },
        ]),
      },
    ],
  },
  {
    name: "Business English Test",
    description: "Professional communication exam",
    timeExam: 60,
    level: "MEDIUM",
    chapterId: chapterIds[1],
    questions: [
      {
        type: "MCQ",
        content: "Choose formal greeting:",
        order: 1,
        options: [
          { content: "dear sir/madam" },
          { content: "hey there" },
          { content: "hi folks" },
        ],
        correctAnswer: "dear sir/madam",
      },
      {
        type: "MCQ",
        content: "Select appropriate closing:",
        order: 2,
        options: [
          { content: "best regards" },
          { content: "later" },
          { content: "bye" },
        ],
        correctAnswer: "best regards",
      },
      {
        type: "ARRANGE",
        content: "Arrange email components:",
        order: 3,
        correctAnswer: [
          "dear",
          "mr.",
          "johnson",
          ",",
          "i",
          "am",
          "writing",
          "to",
          "follow",
          "up",
          ".",
        ],
        options: shuffleArray([
          { content: "johnson" },
          { content: "writing" },
          { content: "dear" },
          { content: "mr." },
          { content: "i" },
          { content: "am" },
          { content: "to" },
          { content: "follow" },
          { content: "up" },
          { content: "," },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Create meeting invitation:",
        order: 4,
        correctAnswer: [
          "please",
          "join",
          "the",
          "meeting",
          "at",
          "10",
          "am",
          "tomorrow",
          ".",
        ],
        options: shuffleArray([
          { content: "10" },
          { content: "join" },
          { content: "please" },
          { content: "the" },
          { content: "meeting" },
          { content: "am" },
          { content: "at" },
          { content: "tomorrow" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Formal request arrangement:",
        order: 5,
        correctAnswer: ["could", "you", "please", "send", "the", "report", "?"],
        options: shuffleArray([
          { content: "send" },
          { content: "report" },
          { content: "could" },
          { content: "you" },
          { content: "please" },
          { content: "the" },
          { content: "?" },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Arrange presentation outline:",
        order: 6,
        correctAnswer: [
          "introduction",
          "market",
          "analysis",
          "financial",
          "projections",
          "conclusion",
          ".",
        ],
        options: shuffleArray([
          { content: "market" },
          { content: "projections" },
          { content: "introduction" },
          { content: "analysis" },
          { content: "financial" },
          { content: "conclusion" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Contract clause arrangement:",
        order: 7,
        correctAnswer: [
          "this",
          "agreement",
          "shall",
          "be",
          "governed",
          "by",
          "law",
          ".",
        ],
        options: shuffleArray([
          { content: "governed" },
          { content: "law" },
          { content: "this" },
          { content: "agreement" },
          { content: "shall" },
          { content: "be" },
          { content: "by" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Arrange negotiation phrases:",
        order: 8,
        correctAnswer: [
          "we",
          "propose",
          "a",
          "mutually",
          "beneficial",
          "solution",
          ".",
        ],
        options: shuffleArray([
          { content: "solution" },
          { content: "mutually" },
          { content: "we" },
          { content: "propose" },
          { content: "a" },
          { content: "beneficial" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Arrange conference details:",
        order: 9,
        correctAnswer: [
          "the",
          "conference",
          "will",
          "be",
          "held",
          "in",
          "paris",
          ".",
        ],
        options: shuffleArray([
          { content: "paris" },
          { content: "held" },
          { content: "the" },
          { content: "conference" },
          { content: "will" },
          { content: "be" },
          { content: "in" },
          { content: "." },
        ]),
      },
      {
        type: "ARRANGE",
        content: "Arrange project timeline:",
        order: 10,
        correctAnswer: ["phase", "1", "starts", "on", "march", "1st", "."],
        options: shuffleArray([
          { content: "march" },
          { content: "1st" },
          { content: "phase" },
          { content: "1" },
          { content: "on" },
          { content: "starts" },
          { content: "." },
        ]),
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
