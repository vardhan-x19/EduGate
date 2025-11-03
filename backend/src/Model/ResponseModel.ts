import mongoose, { Document, Schema } from "mongoose";


export interface IResponse extends Document {
  quiz: mongoose.Types.ObjectId | string;
  student: {
    id: mongoose.Types.ObjectId | string;
    name: string;
    email?: string;
  };
  score: number; // total correct answers or points
  totalQuestions: number;
  timeTaken?: number; // seconds (optional)
  createdAt: Date;
}


const ResponseSchema = new Schema<IResponse>(
  {
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    student: {
      id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String },
    },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeTaken: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IResponse>("Response", ResponseSchema);
