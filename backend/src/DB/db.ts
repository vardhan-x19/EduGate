import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, {
      // these options are no longer required in newer mongoose versions,
      // but adding them won’t break anything
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1); // exit if DB connection fails
  }
};

export default dbConnection;