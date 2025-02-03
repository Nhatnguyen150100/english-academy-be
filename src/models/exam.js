const { Schema, model } = require("mongoose");
const logger = require("../config/winston");

const optionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

const questionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  options: [optionSchema],
  correctAnswer: {
    type: String,
    required: true,
  },
});

const examSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timeExam: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },
    questions: [questionSchema],
  },
  { timestamps: true },
);

const deleteMany = async () => {
  try {
    const result = await Exam.deleteMany({});
    logger.info(`Deleted ${result.deletedCount} exams successfully`);
    return result;
  } catch (error) {
    logger.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (exams) => {
  try {
    const result = await Exam.insertMany(exams);
    logger.info(`Inserted ${result.length} exams successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

const Exam = model("Exam", examSchema);

module.exports = { Exam, deleteMany, insertMany };
