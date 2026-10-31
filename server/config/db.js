import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/medinminutes';
  try {
    console.log('🔄 Attempting MongoDB connection...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('✅ Connected to MongoDB database successfully!');
    return true;
  } catch (err) {
    console.log(`ℹ️ MongoDB connection not available (${err.message}). Using persistent local JSON database engine.`);
    return false;
  }
};
