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
    title: "ReactJS Masterclass 2024",
    thumbnail: "https://picsum.photos/id/48/300/200",
    description: "Khóa học toàn diện về ReactJS từ zero đến hero",
    content: `<p>Trong loạt bài này, chúng ta sẽ cùng nhau khám phá:</p>
              <ul>
                <li>Cơ chế Virtual DOM</li>
                <li>Quản lý state với Redux Toolkit</li>
                <li>Tối ưu hiệu năng ứng dụng</li>
              </ul>`,
    statusBlog: "APPROVED",
    createdAt: "2024-03-01",
    userId: "user_tech01"
  },
  {
    title: "Node.js Performance Optimization",
    thumbnail: "https://picsum.photos/id/25/300/200",
    description: "Kỹ thuật tối ưu hiệu năng cho ứng dụng Node.js",
    content: `<p>Bài viết bao gồm các nội dung nâng cao:</p>
              <ol>
                <li>Cluster Mode</li>
                <li>Caching strategies</li>
                <li>Memory leak detection</li>
              </ol>`,
    statusBlog: "PENDING_APPROVED",
    createdAt: "2024-03-15",
    userId: "user_backend"
  },
  {
    title: "UI/UX Best Practices",
    thumbnail: "https://picsum.photos/id/42/300/200",
    description: "Nguyên tắc thiết kế giao diện người dùng hiện đại",
    content: `<section>
                <h2>10 nguyên tắc vàng</h2>
                <p>1. Consistency là chìa khóa...</p>
              </section>`,
    statusBlog: "REJECTED",
    createdAt: "2024-02-28",
    userId: "user_designer"
  },
  {
    title: "Machine Learning Fundamentals",
    thumbnail: "https://picsum.photos/id/65/300/200",
    description: "Nhập môn AI/ML cho developer",
    content: `<p>Khái niệm cơ bản về:</p>
              <ul>
                <li>Supervised Learning</li>
                <li>Neural Networks</li>
                <li>Model Evaluation</li>
              </ul>`,
    statusBlog: "APPROVED",
    createdAt: "2024-03-10",
    userId: "user_ai_specialist"
  },
  {
    title: "DevOps CI/CD Pipeline",
    thumbnail: "https://picsum.photos/id/106/300/200",
    description: "Xây dựng pipeline tích hợp liên tục với Jenkins",
    content: `<p>Hướng dẫn từng bước thiết lập:</p>
              <ol>
                <li>Cấu hình Jenkins Server</li>
                <li>Viết Jenkinsfile</li>
                <li>Triển khai tự động</li>
              </ol>`,
    statusBlog: "PENDING_APPROVED",
    createdAt: "2024-03-12",
    userId: "user_devops"
  },
  {
    title: "Cybersecurity Essentials",
    thumbnail: "https://picsum.photos/id/201/300/200",
    description: "Bảo mật ứng dụng web từ A đến Z",
    content: `<section>
                <h2>Top 10 lỗ hổng phổ biến (OWASP)</h2>
                <p>1. SQL Injection...</p>
              </section>`,
    statusBlog: "APPROVED",
    createdAt: "2024-03-05",
    userId: "user_security"
  },
  {
    title: "Microservices Architecture",
    thumbnail: "https://picsum.photos/id/180/300/200",
    description: "Thiết kế hệ thống phân tán với Docker và Kubernetes",
    content: `<p>Kiến trúc microservices bao gồm:</p>
              <ul>
                <li>Service Discovery</li>
                <li>API Gateway</li>
                <li>Circuit Breaker</li>
              </ul>`,
    statusBlog: "REJECTED",
    createdAt: "2024-03-08",
    userId: "user_architect"
  },
  {
    title: "Mobile Development Trends",
    thumbnail: "https://picsum.photos/id/160/300/200",
    description: "Xu hướng phát triển ứng dụng di động 2024",
    content: `<p>Phân tích các công nghệ hàng đầu:</p>
              <ol>
                <li>Flutter 3.0</li>
                <li>React Native Optimization</li>
                <li>Kotlin Multiplatform</li>
              </ol>`,
    statusBlog: "APPROVED",
    createdAt: "2024-03-18",
    userId: "user_mobile"
  }
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
