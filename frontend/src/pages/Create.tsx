import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Brain,
  Plus,
  Settings,
  Eye,
  Share2,
  Trash2,
  GripVertical,
  Loader2
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type Question = {
  queNum: number;
  questionText: string;
  options: string[];
  correctAnswer: number; // index of correct option
};

type QuizSettings = {
  title: string;
  description?: string;
  topic?: string;
  difficulty: "beginner" | "intermediate" | "advanced" | string;
  timeLimit?: number;
  isPublic: boolean;
  questions?: Question[];
  tabSwitchDetection?: boolean;
  cameraProctoring?: boolean;
  creator?: string;
  participants?: number;
  icons?: string; // UI uses icons; we'll map to `icon` before sending
  isPrivate?: boolean;
  // ...other fields allowed
};

const Create = () => {
  const [activeTab, setActiveTab] = useState<string>("ai");

  const [questions, setQuestions] = useState<Question[]>([
    {
      queNum: 1,
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);

  // keep quizSettings.questions in sync with questions via useEffect
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    title: "",
    description: "",
    topic: "",
    difficulty: "beginner",
    timeLimit: 15,
    isPublic: true,
    questions,
    tabSwitchDetection: false,
    cameraProctoring: false,
    creator: "teacher",
    participants: 0,
    icons: "default",
    isPrivate: false
  });

  useEffect(() => {
    setQuizSettings(prev => ({ ...prev, questions }));
  }, [questions]);

  // aiSettings kept local; numberOfQuestions will be mapped when calling API
  const [aiSettings, setAiSettings] = useState({
    topic: "",
    difficulty: "medium", // keep UI-friendly value, we'll map before send
    questionCount: 5,
    timeLimit: 15 // seconds/minutes depending on your interpretation — not used by create route
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addQuestion = useCallback(() => {
    setQuestions(prev => [
      ...prev,
      {
        queNum: prev.length + 1,
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0
      }
    ]);
  }, []);

  const removeQuestion = (queNum: number) => {
    const filtered = questions
      .filter(q => q.queNum !== queNum)
      .map((q, idx) => ({ ...q, queNum: idx + 1 })); // re-index
    setQuestions(filtered);
  };

  const updateQuestion = (queNum: number, field: keyof Question, value: any) => {
    const updated = questions.map(q =>
      q.queNum === queNum ? { ...q, [field]: value } : q
    );
    setQuestions(updated);
  };

  const updateQuestionOption = (questionId: number, optionIndex: number, value: string) => {
    const updated = questions.map(q =>
      q.queNum === questionId
        ? { ...q, options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)) }
        : q
    );
    setQuestions(updated);
  };

  // Helper to map frontend difficulty -> backend enum
  const mapDifficultyForBackend = (d: string) => {
    if (!d) return d;
    if (d === "medium") return "intermediate";
    // allow other values to pass through (backend expects beginner/intermediate/advanced)
    return d;
  };

  // generateQuestions (calls AI endpoint) - keep robust normalization from earlier
  const generateQuestions = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("quiztoken") ?? "";

      const payload = {
        topic: aiSettings.topic,
        numberOfQuestions: aiSettings.questionCount,
        difficulty: aiSettings.difficulty // AI endpoint can accept 'medium' — this is backend AI endpoint
      };

      const response = await axios.post(
        "http://localhost:5000/quiz/create/ai",
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        }
      );

      const respData = response.data ?? {};
      const root = respData.result ?? respData;

      // find questions array in response
      let rawQuestions: any[] | undefined;
      if (Array.isArray(root)) rawQuestions = root;
      else rawQuestions = root.questions ?? respData.questions ?? undefined;

      if (!Array.isArray(rawQuestions)) {
        console.error("AI generate: full response:", response.data);
        throw new Error("Unexpected AI response shape — `questions` array not found.");
      }

      // Normalize questions (robust)
      const normalized: Question[] = rawQuestions.map((q: any, idx: number) => {
        const pickOpts = q.options ?? q.choices ?? q.answers ?? q.items ?? [];
        const finalOpts: string[] = Array.isArray(pickOpts)
          ? pickOpts.map((o: any) => {
              if (o == null) return "";
              if (typeof o === "string" || typeof o === "number") return String(o).trim();
              if (typeof o === "object") return String(o.text ?? o.label ?? o.value ?? o.option ?? JSON.stringify(o)).slice(0, 200);
              return String(o);
            })
          : [];

        const opts = finalOpts.slice(0, 4);
        while (opts.length < 4) opts.push("");

        // determine correct index
        let correctIndex = -1;
        const idxFields = ["correctAnswer","correctAnswerIndex","answerIndex","correctIndex","answer","correct"];
        for (const f of idxFields) {
          const val = q[f];
          if (typeof val === "number" && Number.isFinite(val)) { correctIndex = Number(val); break; }
          if (typeof val === "string" && /^\d+$/.test(val.trim())) { correctIndex = parseInt(val.trim(), 10); break; }
        }
        if (correctIndex === -1 && typeof q.answer === "string") {
          const a = q.answer.trim();
          if (/^[A-Z]$/i.test(a)) {
            const letterIdx = a.toUpperCase().charCodeAt(0) - 65;
            if (letterIdx >= 0 && letterIdx < opts.length) correctIndex = letterIdx;
          } else {
            const findIdx = opts.findIndex(o => o.trim().toLowerCase() === a.toLowerCase());
            if (findIdx !== -1) correctIndex = findIdx;
          }
        }
        if (correctIndex === -1 && Array.isArray(pickOpts) && typeof pickOpts[0] === "object") {
          const found = pickOpts.findIndex((o: any) => o.correct === true || o.isCorrect === true);
          if (found !== -1) correctIndex = found;
        }
        if (correctIndex === -1) correctIndex = 0;
        const clamped = Math.min(Math.max(Number(correctIndex) || 0, 0), Math.max(opts.length - 1, 0));

        const questionText = String(q.questionText ?? q.question ?? q.prompt ?? q.title ?? "").trim();

        return {
          queNum: typeof q.queNum === "number" ? q.queNum : idx + 1,
          questionText,
          options: opts,
          correctAnswer: clamped
        } as Question;
      });

      setQuestions(normalized);

      // Pull metadata if present and update quizSettings
      const returnedTitle = root.title ?? root.quizTitle ?? root.name ?? respData.title ?? null;
      const returnedDescription = root.description ?? root.summary ?? root.desc ?? respData.description ?? null;
      const returnedTopic = root.topic ?? aiSettings.topic ?? null;
      const returnedDifficulty = root.difficulty ?? aiSettings.difficulty ?? null;

      // convert time if needed
      let returnedTimeMinutes: number | undefined;
      const timeCandidate = root.timeLimit ?? respData.timeLimit ?? root.time_limit ?? respData.time_limit;
      if (typeof timeCandidate === "number") returnedTimeMinutes = timeCandidate > 120 ? Math.ceil(timeCandidate / 60) : timeCandidate;
      else if (typeof timeCandidate === "string" && /^\d+$/.test(timeCandidate.trim())) {
        const n = parseInt(timeCandidate.trim(), 10);
        returnedTimeMinutes = n > 120 ? Math.ceil(n / 60) : n;
      }

      setQuizSettings(prev => ({
        ...prev,
        title: (returnedTitle ?? prev.title) as string,
        description: (returnedDescription ?? prev.description) as string,
        topic: (returnedTopic ?? prev.topic) as string,
        // keep UI value but we will map before sending to backend
        difficulty: returnedDifficulty ?? prev.difficulty,
        timeLimit: returnedTimeMinutes ?? prev.timeLimit
      }));

      setActiveTab("custom");
    } catch (err: any) {
      console.error("AI generation failed:", err);
      setErrorMsg(err?.response?.data?.message ?? err?.message ?? "AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  // CREATE / PUBLISH QUIZ — matches backend expectation (body.quizSettings & body.questions)
  const createQuiz = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("quiztoken") ?? "";

      // Map frontend names to backend-friendly shape:
      // - nest settings under `quizSettings`
      // - map difficulty "medium" -> "intermediate" (backend enum)
      // - map `icons` -> `icon`
      const difficultyForBackend = mapDifficultyForBackend(String(quizSettings.difficulty ?? ""));
      const quizSettingsForBackend: any = {
        ...quizSettings,
        difficulty: difficultyForBackend,
        icon: (quizSettings as any).icons ?? (quizSettings as any).icon ?? "default"
      };

      // Ensure questions array is simple POJOs and clamp correctAnswer
      const safeQuestions = questions.map(q => ({
        queNum: q.queNum,
        questionText: q.questionText ?? "",
        options: Array.isArray(q.options) ? q.options.slice(0, 4).map(o => String(o ?? "")) : ["", "", "", ""],
        correctAnswer: Math.min(Math.max(Number.isFinite(q.correctAnswer) ? q.correctAnswer : 0, 0), 3)
      }));

      const payload = {
        quizSettings: quizSettingsForBackend,
        questions: safeQuestions
      };

      const res = await axios.post("http://localhost:5000/quiz/create", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        }
      });

      // basic success feedback
      if (res.data?.message) {
        // eslint-disable-next-line no-alert
        alert(res.data.message);
      } else if (res.data?.quiz?._id) {
        // eslint-disable-next-line no-alert
        alert("Quiz created successfully (id: " + res.data.quiz._id + ")");
      } else {
        // eslint-disable-next-line no-alert
        alert("Quiz created successfully");
      }
    } catch (err: any) {
      console.error("Error creating quiz:", err);
      setErrorMsg(err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message ?? "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Create <span className="bg-gradient-primary bg-clip-text text-transparent">Quiz</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Build engaging quizzes with AI assistance or create custom questions from scratch.
          </p>
        </motion.div>

        {/* Quiz Creation Tabs (UI is the same as you had) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Quiz Generator
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Custom Quiz Builder
              </TabsTrigger>
            </TabsList>

            {/* AI Tab (keeps same UI) */}
            <TabsContent value="ai" className="space-y-6">
              {/* AI card, inputs, generate button */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI-Powered Quiz Generation
                  </CardTitle>
                  <CardDescription>
                    Let our AI create engaging questions based on your topic and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input id="quiz-title" placeholder="Enter quiz title" value={quizSettings.title}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-description">Description</Label>
                    <Textarea id="quiz-description" placeholder="Describe what this quiz covers" value={quizSettings.description}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, description: e.target.value }))} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ai-topic">Topic</Label>
                      <Input id="ai-topic" placeholder="e.g., JavaScript, World History, Biology"
                        value={aiSettings.topic} onChange={(e) => setAiSettings(prev => ({ ...prev, topic: e.target.value }))} />
                    </div>

                    <div className="space-y-2">
                      <Label>Difficulty Level</Label>
                      <Select value={aiSettings.difficulty} onValueChange={(value) => setAiSettings(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Questions</Label>
                      <Select value={aiSettings.questionCount.toString()} onValueChange={(value) => setAiSettings(prev => ({ ...prev, questionCount: parseInt(value, 10) }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Questions</SelectItem>
                          <SelectItem value="10">10 Questions</SelectItem>
                          <SelectItem value="15">15 Questions</SelectItem>
                          <SelectItem value="20">20 Questions</SelectItem>
                          <SelectItem value="25">25 Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Time Limit</Label>
                      <Select value={aiSettings.timeLimit.toString()} onValueChange={(value) => setAiSettings(prev => ({ ...prev, timeLimit: parseInt(value, 10) }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 Seconds</SelectItem>
                          <SelectItem value="30">30 Seconds</SelectItem>
                          <SelectItem value="60">1 Minute</SelectItem>
                          <SelectItem value="120">2 Minutes</SelectItem>
                          <SelectItem value="300">5 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={generateQuestions} variant="gradient" size="lg" className="w-full" disabled={loading}>
                      {loading ? (<><Loader2 className="animate-spin h-5 w-5 mr-2" />Generating...</>) : (<><Brain className="h-5 w-5 mr-2" />Generate Quiz with AI</>)}
                    </Button>
                    {errorMsg && <p className="text-sm text-destructive mt-2">{errorMsg}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Questions (same UI) */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Questions</CardTitle>
                      <CardDescription>Add and manage your quiz questions.</CardDescription>
                    </div>
                    <Button onClick={addQuestion} variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Add Question</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.queNum} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">Question {index + 1}</Badge>
                        </div>
                        {questions.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.queNum)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea placeholder="Enter your question" value={question.questionText} onChange={(e) => updateQuestion(question.queNum, "questionText", e.target.value)} />
                      </div>

                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <input type="radio" name={`correct-${question.queNum}`} checked={question.correctAnswer === optionIndex} onChange={() => updateQuestion(question.queNum, "correctAnswer", optionIndex)} className="text-primary" />
                              <Label className="text-sm">Correct</Label>
                            </div>
                            <Input placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`} value={option} onChange={(e) => updateQuestionOption(question.queNum, optionIndex, e.target.value)} className="flex-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Settings + Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Quiz Settings</CardTitle>
                  <CardDescription>Configure privacy and security options for your quiz.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5"><Label>Public Quiz</Label><p className="text-sm text-muted-foreground">Make this quiz discoverable by other users</p></div>
                      <Switch checked={quizSettings.isPublic} onCheckedChange={(c) => setQuizSettings(prev => ({ ...prev, isPublic: c }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5"><Label>Tab Switch Detection</Label><p className="text-sm text-muted-foreground">Warn when participants switch browser tabs</p></div>
                      <Switch checked={quizSettings.tabSwitchDetection} onCheckedChange={(c) => setQuizSettings(prev => ({ ...prev, tabSwitchDetection: c }))} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5"><Label>Camera Proctoring</Label><p className="text-sm text-muted-foreground">Enable camera monitoring during the quiz</p></div>
                      <Switch checked={quizSettings.cameraProctoring} onCheckedChange={(c) => setQuizSettings(prev => ({ ...prev, cameraProctoring: c }))} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" className="flex-1"><Eye className="h-5 w-5 mr-2" />Preview Quiz</Button>
                <Button onClick={createQuiz} variant="gradient" size="lg" className="flex-1" disabled={loading}><Share2 className="h-5 w-5 mr-2" />Publish Quiz</Button>
              </div>
            </TabsContent>

            {/* Custom Tab - same UI/behaviour (createQuiz will still be used) */}
            <TabsContent value="custom" className="space-y-6">
              {/* Quiz Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Information</CardTitle>
                  <CardDescription>Set up basic information about your quiz.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input id="quiz-title" placeholder="Enter quiz title" value={quizSettings.title} onChange={(e) => setQuizSettings(prev => ({ ...prev, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-description">Description</Label>
                    <Textarea id="quiz-description" placeholder="Describe what this quiz covers" value={quizSettings.description} onChange={(e) => setQuizSettings(prev => ({ ...prev, description: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiz-topic">Topic</Label>
                      <Input id="quiz-topic" placeholder="e.g., Programming" value={quizSettings.topic} onChange={(e) => setQuizSettings(prev => ({ ...prev, topic: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={quizSettings.difficulty} onValueChange={(value) => setQuizSettings(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Time Limit (minutes)</Label>
                      <Input type="number" min={1} max={120} value={quizSettings.timeLimit} onChange={(e) => setQuizSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value || "0", 10) }))} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions (reuse) */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Questions</CardTitle>
                      <CardDescription>Add and manage your quiz questions.</CardDescription>
                    </div>
                    <Button onClick={addQuestion} variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Add Question</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.queNum} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">Question {index + 1}</Badge>
                        </div>
                        {questions.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.queNum)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea placeholder="Enter your question" value={question.questionText} onChange={(e) => updateQuestion(question.queNum, "questionText", e.target.value)} />
                      </div>

                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <input type="radio" name={`correct-${question.queNum}`} checked={question.correctAnswer === optionIndex} onChange={() => updateQuestion(question.queNum, "correctAnswer", optionIndex)} className="text-primary" />
                              <Label className="text-sm">Correct</Label>
                            </div>
                            <Input placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`} value={option} onChange={(e) => updateQuestionOption(question.queNum, optionIndex, e.target.value)} className="flex-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" className="flex-1"><Eye className="h-5 w-5 mr-2" />Preview Quiz</Button>
                <Button onClick={createQuiz} variant="gradient" size="lg" className="flex-1" disabled={loading}><Share2 className="h-5 w-5 mr-2" />Publish Quiz</Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Create;
