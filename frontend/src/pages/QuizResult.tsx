import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle2, 
  XCircle,
  Star,
  Share2,
  RotateCcw,
  Home,
  TrendingUp,
  Award
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();


  const {
    score,
    correctCount,
    totalQuestions,
    timeSpent,
    quizTitle,
    answers,
    questions
  } = location.state || {
    score: 0,
    correctCount: 0,
    totalQuestions: 0,
    timeSpent: 0,
    quizTitle: "Quiz",
    answers: {},
    questions: []
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceLevel = () => {
    if (score >= 90) return { text: "Outstanding!", color: "text-success", badge: "🏆" };
    if (score >= 75) return { text: "Great Job!", color: "text-primary", badge: "⭐" };
    if (score >= 60) return { text: "Good Effort!", color: "text-warning", badge: "👍" };
    return { text: "Keep Practicing!", color: "text-muted-foreground", badge: "📚" };
  };

  const performance = getPerformanceLevel();
  const xpEarned = Math.floor(score * 10);
  const accuracy = ((correctCount / totalQuestions) * 100).toFixed(1);

  const handleShare = () => {
    toast({
      title: "Results Shared!",
      description: "Your quiz results have been shared successfully.",
    });
  };

  const handleRetake = () => {
    navigate(-2); // Go back to quiz selection
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl mb-4"
            >
              {performance.badge}
            </motion.div>
            <h1 className={`text-4xl font-bold mb-2 ${performance.color}`}>
              {performance.text}
            </h1>
            <p className="text-xl text-muted-foreground">{quizTitle}</p>
          </div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-card border-0 shadow-xl inline-block px-12 py-8">
              <div className="text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                {Math.round(score)}%
              </div>
              <p className="text-muted-foreground">Your Score</p>
            </Card>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-success">{correctCount}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <div className="text-2xl font-bold text-destructive">{totalQuestions - correctCount}</div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{formatTime(timeSpent)}</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-warning">+{xpEarned}</div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-sm font-medium">{accuracy}%</span>
                </div>
                <Progress value={parseFloat(accuracy)} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{(timeSpent / totalQuestions).toFixed(1)}s</div>
                  <div className="text-sm text-muted-foreground">Avg Time/Question</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{Math.min(Math.floor(score / 10), 5)}/5</div>
                  <div className="text-sm text-muted-foreground">Performance Stars</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Earned */}
        {score >= 90 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card className="bg-gradient-primary border-0 text-white shadow-glow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Award className="h-12 w-12" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Achievement Unlocked!</h3>
                    <p className="opacity-90">Outstanding Performance - Scored above 90%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="gradient" size="lg" onClick={handleShare} className="shadow-glow">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
          <Button variant="outline" size="lg" onClick={handleRetake}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Quiz
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/quiz">
              <Home className="h-4 w-4 mr-2" />
              Browse Quizzes
            </Link>
          </Button>
        </motion.div>

        {/* Question Review Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">Question Review</h2>
          <div className="space-y-4">
            {questions.map((question: any, index: number) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={isCorrect ? 'border-success' : 'border-destructive'}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={isCorrect ? "default" : "destructive"} className="bg-gradient-success">
                            Question {index + 1}
                          </Badge>
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{question.question}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {question.options.map((option: string, optionIndex: number) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${
                              isCorrectAnswer
                                ? 'border-success bg-success/10'
                                : isUserAnswer
                                ? 'border-destructive bg-destructive/10'
                                : 'border-border'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectAnswer && <CheckCircle2 className="h-4 w-4 text-success" />}
                              {isUserAnswer && !isCorrectAnswer && <XCircle className="h-4 w-4 text-destructive" />}
                              <span>{option}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {question.explanation && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default QuizResults;
