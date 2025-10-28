import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  topic?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  timeLimit?: number;
  participants: number;
  icon?: string;
  isPrivate: boolean;
  creator: string; // using normal string as you sent
  questions: IQuestion[];
  shareCode: string;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
});

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    topic: { type: String },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    timeLimit: { type: Number },
    participants: { type: Number, default: 0 },
    icon: { type: String },
    isPrivate: { type: Boolean, default: false },
    creator: { type: String, required: true }, // keeping string as per your JSON
    questions: { type: [QuestionSchema], default: [] },
    shareCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
