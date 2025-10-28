import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Question {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id?: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  timeLimit: number;
  participants?: number;
  icon?: string;
  isPrivate?: string;
  creator?: string;
  questions: Question[];
}

interface QuizState {
  quizzes: Quiz[];
}

const initialState: QuizState = {
  quizzes: [],
};

const quizSlice = createSlice({
  name: "quizzes",
  initialState, // ✅ Correct — not []
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload; // ✅ handles full array of quizzes
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.push(action.payload); // ✅ pushes single quiz
    },
  },
});

export const { setQuizzes, addQuiz } = quizSlice.actions;
export default quizSlice.reducer; // ✅ make sure to export reducer, not slice
