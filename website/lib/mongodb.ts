import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb://127.0.0.1:27017/gopu-exports";

export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}