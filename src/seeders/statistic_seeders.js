const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../config/winston");
const { deleteMany, insertMany } = require("../models/statistic");
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

const generateDailyStats = () => {
  const stats = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    stats.push({
      date: date.toISOString().split("T")[0],
      totalAmount: (Math.floor(Math.random() * (500 - 100 + 1)) + 100) * 1000,
    });
  }

  return stats;
};

const generateMonthlyStats = () => {
  const stats = [];
  const currentYear = new Date().getFullYear();

  for (let month = 1; month <= 12; month++) {
    stats.push({
      date: `${currentYear}-${month.toString().padStart(2, "0")}`,
      totalAmount:
        (Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000) * 1000,
    });
  }

  return stats;
};

const generateYearlyStats = () => {
  const stats = [];
  const currentYear = new Date().getFullYear();

  for (let year = currentYear - 2; year <= currentYear; year++) {
    stats.push({
      date: year.toString(),
      totalAmount:
        (Math.floor(Math.random() * (200000 - 100000 + 1)) + 100000) * 1000,
    });
  }

  return stats;
};

const seedStatistics = async () => {
  await connectDB();

  try {
    await deleteMany();
    logger.info("Cleaned previous statistics data");

    const dailyStats = generateDailyStats();
    const monthlyStats = generateMonthlyStats();
    const yearlyStats = generateYearlyStats();

    const allStats = [...dailyStats, ...monthlyStats, ...yearlyStats];

    await insertMany(allStats);
    logger.info(`Inserted ${allStats.length} statistics records successfully`);
  } catch (error) {
    logger.error("Error seeding statistics:", error);
  } finally {
    connection.close();
  }
};

module.exports = seedStatistics;
