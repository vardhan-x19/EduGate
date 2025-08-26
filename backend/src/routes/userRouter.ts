import { Router, Request, Response } from "express";
import User from "../Model/UserModel";
import authenticate from "../Middlewares/auth.middleware";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    // console.log("Register route accessed", req.body);
    const { name, email, role, password } = req.body;
    if (!email.endsWith("@tkrcet.com")) {
      return res.status(400).json({ message: "Email must end with @tkrcet.com" });
    }
    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // create new user
    const user = new User({ name, email, role, password });
    await user.save();

    // generate token
    const token = user.generateAuthToken();
    //maintaining tokens in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on HTTPS
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
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

router.post("/login", async (req: Request, res: Response) => {
  try {
    // console.log("Login route accessed", req.body);
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;
    // console.log("Login attempt:", { email, password });
    // check if user exists
     if (!email.endsWith("@tkrcet.com")) {
      return res.status(400).json({ message: "Email must end with @tkrcet.com" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // generate token
    const token = user.generateAuthToken();

    //maintaining tokens in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on HTTPS
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

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
// GET /api/auth/profile
router.get("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token"); // Clear the token cookie
  res.json({ message: "Logged out successfully" });
});
export default router;