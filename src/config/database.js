import { default as mongoose } from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connection is established');
  } catch (err) {
    console.error('❌ MongoDB connection is failed:', err);
    process.exit(1);
  }
};

export default connectDB;