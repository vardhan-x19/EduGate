import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./DB/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnection();


app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Backend with TypeScript is running!");
});

app.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});
