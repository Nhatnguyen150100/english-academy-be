const mongoose = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../config/winston");
const { insertMany, deleteMany } = require("../models/blog");
const { User } = require("../models/user");
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

const blogs = [
  {
    title: "Hướng dẫn học ReactJS từ cơ bản",
    thumbnail: "https://example.com/react-thumbnail.jpg",
    description: "Nhập môn ReactJS cho người mới bắt đầu",
    content: "ReactJS là một thư viện JavaScript phổ biến...",
    statusBlog: "APPROVED",
  },
  {
    title: "Toàn tập về Node.js",
    thumbnail: "https://example.com/nodejs-thumbnail.png",
    description: "Xây dựng ứng dụng web với Node.js",
    content: "Node.js cho phép chạy JavaScript trên server...",
    statusBlog: "PENDING_APPROVED",
  },
  {
    title: "Hướng dẫn đến với Web Development",
    thumbnail: "https://example.com/thumb1.jpg",
    description: "Bài viết tổng quan về con đường trở thành Web Developer",
    content: "Nội dung chi tiết...",
    statusBlog: "APPROVED",
  },
  {
    title: "Machine Learning cơ bản",
    thumbnail: "https://example.com/thumb2.jpg",
    description: "Giới thiệu các khái niệm cơ bản trong Machine Learning",
    content: "Nội dung chi tiết về ML...",
    statusBlog: "PENDING_APPROVED",
  },
];

const seedBlogs = async () => {
  await connectDB();

  await deleteMany();

  const users = await User.find();

  await insertMany(
    blogs.map((_item) => ({
      ..._item,
      userId: users[0]._id,
    })),
  );

  connection.close();
};

module.exports = seedBlogs;
