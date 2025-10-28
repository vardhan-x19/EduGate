import { Request, Response } from "express";
import generateQuiz from "../services/ai.services"

export const aiGenerateQuiz = async (req: Request, res: Response) => {
    try {
        const { topic, numberOfQuestions } = req.body;
        if (!topic || !numberOfQuestions) {
            return res.status(400).json({
                message: "Topic and Number of Questions are required"
            });
        }
        const quiz = await generateQuiz(topic, numberOfQuestions);
        return res.status(200).json({
            success:true,
            result:quiz
        });

    } catch (error) {
        console.error("Error while generating quiz", error);
        return res.status(500).json({
            message: "Failed to generate quiz"
        });
    }
}

export const generateQuizController = aiGenerateQuiz;