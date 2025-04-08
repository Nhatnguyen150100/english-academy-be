const { Schema, model } = require("mongoose");
const logger = require("../config/winston");

const optionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

const questionSchema = new Schema({
  type: {
    type: String,
    enum: ["MCQ", "ARRANGE"],
    required: true,
    default: "MCQ",
  },
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  options: {
    type: [optionSchema],
    required: function () {
      return this.type === "MCQ";
    },
  },
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function (value) {
        if (this.type === "MCQ") {
          return (
            typeof value === "string" &&
            this.options.some((opt) => opt.content === value.toString())
          );
        }
        if (this.type === "ARRANGE") {
          return (
            Array.isArray(value) &&
            value.every((content) =>
              this.options.some((opt) => opt.content === content.toString()),
            )
          );
        }
        return false;
      },
      message: "Invalid correct answer format for question type",
    },
  },
});

const examSchema = new Schema(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
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
