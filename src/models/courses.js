const { Schema, model } = require("mongoose");
const logger = require("../config/winston");

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    exams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
  },
  { timestamps: true },
);

const deleteMany = async () => {
  try {
    const result = await Course.deleteMany({});
    logger.info(`Deleted ${result.deletedCount} courses successfully`);
    return result;
  } catch (error) {
    logger.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (courses) => {
  try {
    const result = await Course.insertMany(courses);
    logger.info(`Inserted ${result.length} courses successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

const Course = model("Course", courseSchema);

module.exports = { Course, deleteMany, insertMany };
