import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./DB/db";
import userRouter from "./routes/userRouter";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
dbConnection();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Backend with TypeScript is running!");
});
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});
