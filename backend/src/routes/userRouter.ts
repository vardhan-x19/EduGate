import { Router, Request, Response } from "express";
import User from "../Model/UserModel";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    console.log("Register route accessed", req.body);
    const { name, email, role, password } = req.body;

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // create new user
    const user = new User({ name, email, role, password });
    await user.save();

    // generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});



// Login user

router.get("/login", async (req: Request, res: Response) => {
  try {
    console.log("Login route accessed", req.body);
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // generate token
    const token = user.generateAuthToken();

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, message: "Login failed" });
  }
});
export default router;