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

  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// 2. Schema
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["teacher", "student"], required: true },
  password: { type: String, required: true }, // store hashed password
  createdAt: { type: Date, default: Date.now },
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

// 6. Export model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
