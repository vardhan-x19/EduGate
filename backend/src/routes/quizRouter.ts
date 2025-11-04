import Quiz from "../Model/QuizModel";
import authenticate from "../Middlewares/auth.middleware";
import mongoose from "mongoose";
import User from "../Model/UserModel";
import ResponseModel from "../Model/ResponseModel";
import { Router, Request, Response } from "express";
import { generateQuizController } from "../Controllers/controller";

// Extend Express Request type to include full User object
declare global {
  namespace Express {
    interface UserPayload {
      _id: string;
      name: string;
      email: string;
      role: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

// Create a new quiz
const router = Router();

// Get all quizzes (used by frontend list page)
router.get("/all", async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.find().lean();
    // normalize fields expected by frontend (id, participants, creator, icon, isPrivate)
    const normalized = quizzes.map((q: any) => ({
      id: String(q._id),
      title: q.title,
      description: q.description || "",
      topic: q.topic || "",
      difficulty: q.difficulty || "",
      timeLimit: q.timeLimit || 0,
      questions: q.questions || [],
      participants: q.participants ?? 0,
      // model uses `creator` as string; fall back to createdBy if present
      creator: q.creator || q.createdBy || "",
      shareCode: q.shareCode,
      // keep icon if provided (string name), frontend will map string to component
      icon: q.icon || undefined,
      isPrivate: q.isPrivate || false,
    }));

    res.json({ quizzes: normalized });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/create", authenticate, async (req: Request, res: Response) => {
  try {
    const { title, description, topic, difficulty, timeLimit,creator,participants,icons,isPrivate } = req.body.quizSettings;
    const questions = req.body.questions;
    const shareCode = Math.random().toString(36).substring(2, 8); // simple random code
    // console.log("que", req.body.questions)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // if (req.user) {
    //   console.log(req.user)
    // }
    const quiz = new Quiz({
      title,
      description,
      topic,
      difficulty,
      timeLimit,
      questions,
      createdBy: req.user._id,
      shareCode,
      creator,
      participants,
      icons,
      isPrivate
    });
    
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});

// Note: single /all route above returns normalized quizzes for the frontend

// Get quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("id",id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json({ quiz });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get quiz by share code
router.get("/share/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const quiz = await Quiz.findOne({ shareCode: code });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json({ quiz });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Student submits answers for a quiz — score, save attempt summary on user, optionally store full response
router.post("/:id/submit", authenticate, async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    console.log('id from req.params', req.params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('invalid quiz id', id);
      return res.status(400).json({ error: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // Expect the client to send a summary payload. Example body:
    // { score: number, accuracy: number, quizName?: string, topic?: string, completedDate?: string, totalQuestions?: number, timeTaken?: number }
    const {
      score,
      accuracy,
      quizName,
      topic,
      completedDate,
      totalQuestions,
      timeTaken,
    } = req.body;

    // Basic validation
    if (typeof score !== "number" || typeof accuracy !== "number") {
      return res.status(400).json({ error: "Missing or invalid score/accuracy in request body" });
    }

    const solvedAt = completedDate ? new Date(completedDate) : new Date();

    // Save a lightweight response record (optional) — use provided values
    try {
      const userDoc: any = (req as any).user;
      if (userDoc) {
        await ResponseModel.create({
          quiz: quiz._id,
          student: { id: userDoc._id, name: userDoc.name, email: userDoc.email },
          score,
          totalQuestions: typeof totalQuestions === "number" ? totalQuestions : 0,
          timeTaken,
        });
      }
    } catch (e) {
      console.error("Failed to save response record:", e);
    }

    // Update user's prevSolved using the new summary helper
    if ((req as any).user) {
      const userDoc: any = (req as any).user; // mongoose user document
      try {
        await userDoc.addSolvedQuizSummary({
          quizId: quiz._id,
          score,
          totalQuestions: typeof totalQuestions === "number" ? totalQuestions : undefined,
          accuracy,
          timeTaken,
          quizName,
          topic,
          solvedAt,
        });
      } catch (e) {
        console.error("Failed to add solved quiz summary to user:", e);
      }
    }

    // increment participants count on quiz
    try {
      quiz.participants = (quiz.participants ?? 0) + 1;
      await quiz.save();
    } catch (e) {
      console.error("Failed to increment quiz participants:", e);
    }

    // return the provided summary + user's updated snippets
    const userAfter: any = (req as any).user;
    const avgAccuracy = userAfter && typeof userAfter.getAverageAccuracy === "function" ? userAfter.getAverageAccuracy() : undefined;
    const recent = userAfter && typeof userAfter.getTopPrevSolved === "function" ? userAfter.getTopPrevSolved(3) : undefined;

    res.json({ score, total: totalQuestions ?? 0, accuracy, avgAccuracy, recent });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/create/ai", generateQuizController)

export default router;

// routes/quiz.ts
// import express from "express";
// import Quiz from "../Model/QuizModel";
// import { Request, Response } from "express";

// const router = express.Router();

// /**
//  * @route   POST /quiz/create
//  * @desc    Teacher creates a new quiz
//  */
// router.post("/create", async (req: Request, res: Response) => {
//   try {
//     const { title, description, createdBy, questions } = req.body;

//     // Generate a unique share code (6-digit alphanumeric)
//     const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();

//     const newQuiz = new Quiz({
//       title,
//       description,
//       createdBy,
//       questions,
//       shareCode,
//     });

//     await newQuiz.save();
//     res.status(201).json(newQuiz);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * @route   GET /quiz/:id
//  * @desc    Fetch a quiz by ID
//  */
// router.get("/:id", async (req: Request, res: Response) => {
//   try {
//     const quiz = await Quiz.findById(req.params.id);
//     if (!quiz) return res.status(404).json({ message: "Quiz not found" });
//     res.json(quiz);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * @route   GET /quiz/code/:shareCode
//  * @desc    Fetch quiz using shareCode (students use this)
//  */
// router.get("/code/:shareCode", async (req: Request, res: Response) => {
//   try {
//     const quiz = await Quiz.findOne({ shareCode: req.params.shareCode });
//     if (!quiz) return res.status(404).json({ message: "Quiz not found" });
//     res.json(quiz);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * @route   POST /quiz/:id/submit
//  * @desc    Student submits answers
//  */
// router.post("/:id/submit", async (req: Request, res: Response) => {
//   try {
//     const { answers } = req.body; // array of selected option indexes
//     const quiz = await Quiz.findById(req.params.id);

//     if (!quiz) return res.status(404).json({ message: "Quiz not found" });

//     let score = 0;
//     quiz.questions.forEach((q, i) => {
//       if (answers[i] === q.correctAnswer) score++;
//     });

//     res.json({ score, total: quiz.questions.length });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;