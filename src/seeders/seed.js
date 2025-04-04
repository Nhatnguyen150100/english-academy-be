const logger = require("../config/winston");
const seedBlogs = require("./blog_seeders");
const seedChapters = require("./chapter_seeders");
const seedCourses = require("./course_seeders");
const seedExams = require("./exam_seeders");
const seedUsers = require("./user_seeders");

const runSeeders = async () => {
  logger.info("Seeders started");
  await seedUsers();
  await seedCourses();
  await seedChapters();
  await seedExams();
  await seedBlogs();
  logger.info("Seeders succeeded");
};

runSeeders().catch((error) => {
  logger.error("Seeders failed:", error);
  process.exit(1);
});
