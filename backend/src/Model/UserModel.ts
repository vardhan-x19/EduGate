import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. Define an interface for User
export interface IUser extends Document {
  name: string;
  email: string;
  role: "teacher" | "student";
  password: string;
  createdAt: Date;
  prevSolved: Array<{
    quiz: mongoose.Types.ObjectId | string;
    score: number;
    totalQuestions: number;
    accuracy: number; // percentage 0-100
    timeTaken?: number;
    quizName?: string;
    topic?: string;
    solvedAt: Date;
  }>;

  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  addSolvedQuiz(quizId: mongoose.Types.ObjectId | string, score: number, totalQuestions: number, timeTaken?: number): Promise<IUser>;
  // Add a summary entry supplied by client (score, accuracy etc.)
  addSolvedQuizSummary(payload: {
    quizId: mongoose.Types.ObjectId | string;
    score: number;
    totalQuestions?: number;
    accuracy: number;
    timeTaken?: number;
    quizName?: string;
    topic?: string;
    solvedAt?: Date;
  }): Promise<IUser>;
  getTopPrevSolved(limit?: number): Array<{
    quiz: mongoose.Types.ObjectId | string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    timeTaken?: number;
    solvedAt: Date;
  }>;
  getAverageAccuracy(): number;
}

// 2. Schema
const MAX_PREV_SOLVED = 10; // keep last N entries to avoid unbounded growth

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["teacher", "student"], required: true },
  password: { type: String, required: true }, // store hashed password
  createdAt: { type: Date, default: Date.now },
  prevSolved: {
    type: [
      {
        quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, required: true, min: 0 },
        totalQuestions: { type: Number, required: true, min: 0 },
        accuracy: { type: Number, required: true, min: 0, max: 100 },
        quizName: { type: String },
        topic: { type: String },
        timeTaken: { type: Number },
        solvedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

// 3. Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 4. Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 5. Generate JWT method
UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role }, // payload
    process.env.JWT_SECRET as string, // secret key
    { expiresIn: "1h" } // options
  );
};

// Add a solved quiz entry to the user's prevSolved array and save
UserSchema.methods.addSolvedQuiz = async function (
  this: IUser,
  quizId: mongoose.Types.ObjectId | string,
  score: number,
  totalQuestions: number,
  timeTaken?: number
): Promise<IUser> {
  const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  this.prevSolved = this.prevSolved || [];
  this.prevSolved.push({
    quiz: quizId,
    score,
    totalQuestions,
    accuracy,
    timeTaken,
    solvedAt: new Date(),
  } as any);
  // Trim to last MAX_PREV_SOLVED entries
  if (this.prevSolved.length > MAX_PREV_SOLVED) {
    this.prevSolved = this.prevSolved.slice(-MAX_PREV_SOLVED);
  }
  return this.save();
};

// Add a solved quiz summary supplied by client (trusts provided accuracy/score)
UserSchema.methods.addSolvedQuizSummary = async function (
  this: IUser,
  payload: {
    quizId: mongoose.Types.ObjectId | string;
    score: number;
    totalQuestions?: number;
    accuracy: number;
    timeTaken?: number;
    quizName?: string;
    topic?: string;
    solvedAt?: Date;
  }
): Promise<IUser> {
  const {
    quizId,
    score,
    totalQuestions = 0,
    accuracy,
    timeTaken,
    quizName,
    topic,
    solvedAt,
  } = payload;

  this.prevSolved = this.prevSolved || [];
  // validation: basic bounds
  if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
    throw new Error('Invalid accuracy value');
  }
  if (typeof score !== 'number' || score < 0) {
    throw new Error('Invalid score value');
  }
  if (typeof totalQuestions === 'number' && (totalQuestions < 0 || score > totalQuestions)) {
    throw new Error('Invalid totalQuestions/score relationship');
  }

  this.prevSolved.push({
    quiz: quizId,
    score,
    totalQuestions,
    accuracy,
    timeTaken,
    quizName,
    topic,
    solvedAt: solvedAt || new Date(),
  } as any);
  // Trim to last MAX_PREV_SOLVED entries
  if (this.prevSolved.length > MAX_PREV_SOLVED) {
    this.prevSolved = this.prevSolved.slice(-MAX_PREV_SOLVED);
  }

  return this.save();
}

// Get top (most recent) prevSolved entries, default limit = 3
UserSchema.methods.getTopPrevSolved = function (
  this: IUser,
  limit = 3
) {
  const list = (this.prevSolved || []).slice();
  list.sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime());
  return list.slice(0, limit);
};

// Compute average accuracy across all prevSolved entries
UserSchema.methods.getAverageAccuracy = function (this: IUser) {
  const list = this.prevSolved || [];
  if (list.length === 0) return 0;
  const total = list.reduce((acc, cur) => acc + (typeof cur.accuracy === 'number' ? cur.accuracy : 0), 0);
  return total / list.length;
};

// 6. Export model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
