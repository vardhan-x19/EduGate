// routes/quiz.ts
import express from "express";
import Quiz from "../Model/QuizModel";
import { Request, Response } from "express";

const router = express.Router();

/**
 * @route   POST /quiz/create
 * @desc    Teacher creates a new quiz
 */
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { title, description, createdBy, questions } = req.body;

    // Generate a unique share code (6-digit alphanumeric)
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newQuiz = new Quiz({
      title,
      description,
      createdBy,
      questions,
      shareCode,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /quiz/:id
 * @desc    Fetch a quiz by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /quiz/code/:shareCode
 * @desc    Fetch quiz using shareCode (students use this)
 */
router.get("/code/:shareCode", async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findOne({ shareCode: req.params.shareCode });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /quiz/:id/submit
 * @desc    Student submits answers
 */
router.post("/:id/submit", async (req: Request, res: Response) => {
  try {
    const { answers } = req.body; // array of selected option indexes
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
