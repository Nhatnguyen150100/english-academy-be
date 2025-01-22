const logger = require("../config/winston");
const seedUsers = require("./user_seeders");

const runSeeders = async () => {
  logger.info("Seeders started");
  await seedUsers();
  logger.info("Seeders succeeded");
};

runSeeders().catch((error) => {
  logger.error("Seeders failed:", error);
  process.exit(1);
});