const { Schema, model } = require("mongoose");
const logger = require("../config/winston");

const StatisticSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "statistics",
    timestamps: true,
  },
);

const Statistics = model("Statistics", StatisticSchema);

const deleteMany = async () => {
  try {
    const result = await Statistics.deleteMany({});
    logger.info(`Deleted ${result.deletedCount} item successfully`);
    return result;
  } catch (error) {
    logger.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (item) => {
  try {
    const result = await Statistics.insertMany(item);
    logger.info(`Inserted ${result.length} item successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

module.exports = { Statistics, deleteMany, insertMany };
