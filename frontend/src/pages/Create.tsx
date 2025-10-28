import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { 
  Brain, 
  Plus, 
  Settings, 
  Eye, 
  Share2, 
  Clock, 
  Lock, 
  Camera,
  MonitorSpeaker,
  Trash2,
  GripVertical
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const Create = () => {
  const [activeTab, setActiveTab] = useState("ai");
  const [questions, setQuestions] = useState([
    {
      queNum: 1,
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);
  console.log("questions", questions);
  const [quizSettings, setQuizSettings] = useState({
    title: "",
    description: "",
    topic: "",
    difficulty: "beginner",
    timeLimit: 15,
    isPublic: true,
    questions: questions,
    tabSwitchDetection: false,
    cameraProctoring: false,
    creator: "teacher",
    participants: 0,
    icons: "default",
    isPrivate: false
  });
  console.log("quizSettings", quizSettings);
  
  const [aiSettings, setAiSettings] = useState({
    topic: "",
    difficulty: "beginner",
    questionCount: 10,
    questionType: "multiple-choice"
  });

  const addQuestion = () => {
    const newQuestion = {
      queNum: questions.length + 1,
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
    setQuizSettings(prev => ({ ...prev, questions: [...questions, newQuestion] }));
  };

  const removeQuestion = (queNum: number) => {
    setQuestions(questions.filter(q => q.queNum !== queNum));
  };

  const updateQuestion = (queNum: number, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.queNum === queNum ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.queNum === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const createQuiz = () => {
    const token = localStorage.getItem("quiztoken");
    console.log("quizSettings",quizSettings)
    axios.post(
      "http://localhost:5000/quiz/create",
      { quizSettings, questions },
      {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json"
      }
      }
    )
    .then(response => {
      console.log("Quiz created successfully:", response.data);
    })
    .catch(error => {
      console.error("Error creating quiz:", error);
    });
    console.log("Creating quiz with settings:", quizSettings);
  }
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

        {/* Quiz Creation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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

            {/* AI Quiz Tab */}
            <TabsContent value="ai" className="space-y-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ai-topic">Topic</Label>
                      <Input
                        id="ai-topic"
                        placeholder="e.g., JavaScript, World History, Biology"
                        value={aiSettings.topic}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, topic: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty Level</Label>
                      <Select 
                        value={aiSettings.difficulty} 
                        onValueChange={(value) => setAiSettings(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Number of Questions</Label>
                      <Select 
                        value={aiSettings.questionCount.toString()} 
                        onValueChange={(value) => setAiSettings(prev => ({ ...prev, questionCount: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
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
                      <Label>Question Type</Label>
                      <Select 
                        value={aiSettings.questionType} 
                        onValueChange={(value) => setAiSettings(prev => ({ ...prev, questionType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button variant="gradient" size="lg" className="w-full">
                    <Brain className="h-5 w-5 mr-2" />
                    Generate Quiz with AI
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Quiz Tab */}
            <TabsContent value="custom" className="space-y-6">
              {/* Quiz Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Information</CardTitle>
                  <CardDescription>
                    Set up basic information about your quiz.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input
                      id="quiz-title"
                      placeholder="Enter quiz title"
                      value={quizSettings.title}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-description">Description</Label>
                    <Textarea
                      id="quiz-description"
                      placeholder="Describe what this quiz covers"
                      value={quizSettings.description}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiz-topic">Topic</Label>
                      <Input
                        id="quiz-topic"
                        placeholder="e.g., Programming"
                        value={quizSettings.topic}
                        onChange={(e) => setQuizSettings(prev => ({ ...prev, topic: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select 
                        value={quizSettings.difficulty} 
                        onValueChange={(value) => setQuizSettings(prev => ({ ...prev, difficulty: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Time Limit (minutes)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        value={quizSettings.timeLimit}
                        onChange={(e) => setQuizSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Questions</CardTitle>
                      <CardDescription>
                        Add and manage your quiz questions.
                      </CardDescription>
                    </div>
                    <Button onClick={addQuestion} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.queNum)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea
                          placeholder="Enter your question"
                          value={question.questionText}
                          onChange={(e) => updateQuestion(question.queNum, 'questionText', e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`correct-${question.queNum}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(question.queNum, 'correctAnswer', optionIndex)}
                                className="text-primary"
                              />
                              <Label className="text-sm">Correct</Label>
                            </div>
                            <Input
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                              value={option}
                              onChange={(e) => updateQuestionOption(question.queNum, optionIndex, e.target.value)}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quiz Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quiz Settings
                  </CardTitle>
                  <CardDescription>
                    Configure privacy and security options for your quiz.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Public Quiz</Label>
                        <p className="text-sm text-muted-foreground">
                          Make this quiz discoverable by other users
                        </p>
                      </div>
                      <Switch
                        checked={quizSettings.isPublic}
                        onCheckedChange={(checked) => setQuizSettings(prev => ({ ...prev, isPublic: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Tab Switch Detection</Label>
                        <p className="text-sm text-muted-foreground">
                          Warn when participants switch browser tabs
                        </p>
                      </div>
                      <Switch
                        checked={quizSettings.tabSwitchDetection}
                        onCheckedChange={(checked) => setQuizSettings(prev => ({ ...prev, tabSwitchDetection: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Camera Proctoring</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable camera monitoring during the quiz
                        </p>
                      </div>
                      <Switch
                        checked={quizSettings.cameraProctoring}
                        onCheckedChange={(checked) => setQuizSettings(prev => ({ ...prev, cameraProctoring: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" size="lg" className="flex-1">
                  <Eye className="h-5 w-5 mr-2" />
                  Preview Quiz
                </Button>
                <Button onClick={createQuiz} variant="gradient" size="lg" className="flex-1">
                  <Share2 className="h-5 w-5 mr-2" />
                  Publish Quiz
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Create;