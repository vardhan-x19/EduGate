import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Flag,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Question {
  queNum: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const QuizPlay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizData, setQuizData] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  //  const { id } = useParams();
  console.log("Quiz ID:", quizId);
  useEffect(() => {
    if (!quizId) return;
    setIsLoading(true);
    axios
      .get(`http://localhost:5000/quiz/${quizId}`)
      .then((response) => {
        // Handle successful response
        const fetched = response.data?.quiz || response.data;
        console.log("Quiz data after fetching:", fetched);
        setQuizData(fetched);
        // set timer from fetched timeLimit if provided
        if (fetched?.timeLimit) {
          setTimeRemaining(Number(fetched.timeLimit) * 60);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error fetching quiz data:", error);
      })
      .finally(() => setIsLoading(false));
  }, [quizId]);

  // Timer countdown effect must be declared unconditionally (before any early returns)
  useEffect(() => {
    if (timeRemaining <= 0) {
      // don't call handleSubmit directly here; schedule after render
      // but handleSubmit will be defined by the time this effect runs
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Mock quiz data
  // const quizData = {
  //   id: quizId,
  //   title: "JavaScript Fundamentals",
  //   description: "Test your knowledge of core JavaScript concepts",
  //   timeLimit: 15,
  //   questions: [
  //     {
  //       queNum: 1,
  //       questionText: "What is the correct way to declare a variable in JavaScript that cannot be reassigned?",
  //       options: [
  //         "var myVariable = 'value';",
  //         "let myVariable = 'value';",
  //         "const myVariable = 'value';",
  //         "variable myVariable = 'value';"
  //       ],
  //       correctAnswer: 2,
  //       explanation: "The 'const' keyword is used to declare variables that cannot be reassigned after initialization."
  //     },
  //     {
  //       queNum: 2,
  //       questionText: "Which method is used to add an element to the end of an array?",
  //       options: [
  //         "array.add()",
  //         "array.push()",
  //         "array.append()",
  //         "array.insert()"
  //       ],
  //       correctAnswer: 1,
  //       explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
  //     },
  //     {
  //       queNum: 3,
  //       questionText: "What does the '===' operator do in JavaScript?",
  //       options: [
  //         "Assigns a value to a variable",
  //         "Compares values only",
  //         "Compares both value and type",
  //         "Creates a new variable"
  //       ],
  //       correctAnswer: 2,
  //       explanation: "The === operator checks for strict equality, comparing both value and type."
  //     },
  //     {
  //       queNum: 4,
  //       questionText: "Which of the following is NOT a JavaScript data type?",
  //       options: [
  //         "String",
  //         "Boolean",
  //         "Float",
  //         "Undefined"
  //       ],
  //       correctAnswer: 2,
  //       explanation: "JavaScript uses 'Number' for all numeric values. 'Float' is not a separate data type."
  //     },
  //     {
  //       queNum: 5,
  //       questionText: "What will 'typeof null' return in JavaScript?",
  //       options: [
  //         "'null'",
  //         "'undefined'",
  //         "'object'",
  //         "'number'"
  //       ],
  //       correctAnswer: 2,
  //       explanation: "This is a known quirk in JavaScript - typeof null returns 'object' due to a legacy bug."
  //     }
  //   ] as Question[]
  // };
  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="container py-8 text-center">Loading quiz…</div>
      </Layout>
    );
  }

  if (!quizData || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
    return (
      <Layout showFooter={false}>
        <div className="container py-8 text-center">No questions found for this quiz.</div>
      </Layout>
    );
  }

  const totalQuestions = quizData.questions.length;
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;
  
  // Redirect if invalid quiz index
  if (!currentQuestion) {
    navigate('/quiz');
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    // Calculate score and navigate to results
    let correctCount = 0;
    quizData.questions.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;
    const timeSpent = (quizData.timeLimit * 60) - timeRemaining;

    navigate(`/quiz/${quizId}/results`, {
      state: {
        score,
        correctCount,
        totalQuestions,
        timeSpent,
        quizTitle: quizData.title,
        answers: selectedAnswers,
        questions: quizData.questions
      }
    });
  };

  // Timer countdown
  // (moved earlier to keep hook order stable)

  const getTimeColor = () => {
    if (timeRemaining > 300) return "text-foreground";
    if (timeRemaining > 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <Layout showFooter={false}>
      <div className="container max-w-5xl py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl font-bold mb-1">{quizData.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className={`h-5 w-5 ${getTimeColor()}`} />
                    <span className={`text-xl font-mono font-bold ${getTimeColor()}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>{answeredCount}/{totalQuestions}</span>
                  </div>
                </div>
              </div>
              
              <Progress value={progress} className="mt-4 h-2" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl pr-4">
                    {currentQuestion.questionText}
                  </CardTitle>
                  <Button
                    variant={flaggedQuestions.has(currentQuestionIndex) ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleFlag}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswers[currentQuestionIndex]?.toString() ?? ""}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                >
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {flaggedQuestions.has(currentQuestionIndex) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>This question is flagged for review</span>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button
                      variant="gradient"
                      onClick={() => setShowSubmitDialog(true)}
                      className="shadow-glow"
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="gradient"
                      onClick={handleNext}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Question Navigation */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">Quick Navigation:</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: totalQuestions }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        index === currentQuestionIndex
                          ? 'bg-gradient-primary text-white shadow-glow'
                          : selectedAnswers[index] !== undefined
                          ? 'bg-success text-white'
                          : flaggedQuestions.has(index)
                          ? 'bg-destructive/10 border-2 border-destructive text-destructive'
                          : 'bg-muted hover:bg-muted-foreground/20'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Are you sure you want to submit your quiz?</p>
                <div className="pt-2 space-y-1 text-sm">
                  <p>• Answered: {answeredCount} of {totalQuestions} questions</p>
                  <p>• Unanswered: {totalQuestions - answeredCount} questions</p>
                  {flaggedQuestions.size > 0 && (
                    <p className="text-destructive">• Flagged for review: {flaggedQuestions.size} questions</p>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Review Quiz</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Submit Quiz
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default QuizPlay;
