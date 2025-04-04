const { Schema, model } = require("mongoose");
const logger = require("../config/winston");

const chapterSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    exams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Chapter = model("Chapter", chapterSchema);

const deleteMany = async () => {
  try {
    const result = await Chapter.deleteMany({});
    logger.info(`Deleted ${result.deletedCount} chapters successfully`);
    return result;
  } catch (error) {
    logger.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (chapters) => {
  try {
    const result = await Chapter.insertMany(chapters);
    logger.info(`Inserted ${result.length} chapters successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

module.exports = { Chapter, deleteMany, insertMany };
