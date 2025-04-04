const { Schema, model, models } = require("mongoose");
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
    chapters: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
  },
  { timestamps: true },
);

const courseHelpers = {
  deleteMany: async () => {
    try {
      const result = await Course.deleteMany({});
      logger.info(`Deleted ${result.deletedCount} courses successfully`);
      return result;
    } catch (error) {
      logger.error("Delete failed:", error);
      throw error;
    }
  },

  insertMany: async (courses) => {
    try {
      const result = await Course.insertMany(courses);
      logger.info(`Inserted ${result.length} courses successfully`);
      return result;
    } catch (error) {
      logger.error("Insert failed:", error);
      throw error;
    }
  },
};

const Course = models.Course || model("Course", courseSchema);

module.exports = {
  Course,
  ...courseHelpers,
};
