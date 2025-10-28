import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // exit if DB connection fails
  }
};

export default dbConnection;
