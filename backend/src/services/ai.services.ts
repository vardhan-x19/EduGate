import { GoogleGenAI, Type } from "@google/genai"

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing Crendential For Google GenAI");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      description: "An array of quiz questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          queNum: {
            type: Type.INTEGER,
            description: "The question number in the quiz",
          },
          questionText: {
            type: Type.STRING,
            description: "The text of the question.",
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers.",
            items: {
              type: Type.STRING,
            },
          },
          correctAnswer: {
            type: Type.INTEGER,
            description:
              "The 0-based index of the correct answer in the options array.",
          },
        },
        required: ["questionText", "options", "correctAnswer"],
      },
    },
  },
  required: ["questions"],
};


const generateQuiz = async (topic: string, numberOfQuestions: number, difficulty: string) => {
  try {
    const prompt = `Generate a multiple-choice quiz about "${topic}" with exactly ${numberOfQuestions} questions. Each question must have 4 options. Ensure the correct answer index is accurate. The difficulty level is ${difficulty}.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: quizSchema
      }
    })
    const jsonText = response.text!.trim();
    const parsedData = JSON.parse(jsonText);
    return parsedData;
  } catch (error) {
    console.error("Error while generating the quiz", error);
    throw new Error("Failed to generate the quiz");
  }

  ;
}

export default generateQuiz;


