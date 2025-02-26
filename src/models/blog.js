const { Schema, model } = require("mongoose");
const logger = require("../config/winston");

const blogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    statusBlog: {
      type: String,
      enum: ["PENDING_APPROVED", "APPROVED", "REJECTED"],
      default: "PENDING_APPROVED",
    }
  },
  { timestamps: true },
);

const deleteMany = async () => {
  try {
    const result = await Blog.deleteMany({});
    logger.info(`Deleted ${result.deletedCount} blogs successfully`);
    return result;
  } catch (error) {
    logger.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (blogs) => {
  try {
    const result = await Blog.insertMany(blogs);
    logger.info(`Inserted ${result.length} blogs successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

const Blog = model("Blog", blogSchema);

module.exports = { Blog, deleteMany, insertMany };