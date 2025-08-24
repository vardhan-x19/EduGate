// models/Quiz.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number; // store index of correct option (0,1,2,3)
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId; // Teacher reference
  questions: IQuestion[];
  shareCode: string; // Unique code to share with students
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
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    questions: { type: [QuestionSchema], default: [] },
    shareCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);














// const quiz = new Quiz({
//   title: "JavaScript Basics",
//   description: "Test your JS knowledge",
//   createdBy: teacherId,
//   shareCode: "abc123",
//   questions: [
//     {
//       text: "What is closure in JS?",
//       options: ["A function inside another function", "A loop", "An object"],
//       correctAnswer: 0,
//     },
//     {
//       text: "Which keyword declares a constant?",
//       options: ["var", "let", "const"],
//       correctAnswer: 2,
//     }
//   ]
// });

// await quiz.save();
