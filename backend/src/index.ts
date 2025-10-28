import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./DB/db";
import userRouter from "./routes/userRouter";
import quizRouter from "./routes/quizRouter";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import quizRouter from "./routes/quizRouter";


const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
dbConnection();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:8080", // or your frontend domain
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Backend with TypeScript is running!");
});

app.use("/users", userRouter);
app.use("/quiz", quizRouter);
app.use("/quiz", quizRouter);

app.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});
