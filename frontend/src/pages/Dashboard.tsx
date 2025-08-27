import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Clock, 
  Brain, 
  Award, 
  TrendingUp, 
  PlayCircle,
  Plus,
  Calendar,
  Star,
  Zap,
  BookOpen,
  Users
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useSelector } from "react-redux";
const Dashboard = () => {
  const userProfile = useSelector((state: any) => state.user.user);
  // Mock user data
  console.log("User Profile from Redux:", userProfile);
  const user = {
    name: userProfile.name || "Alex Rodriguez",
    avatar: userProfile.avatar || "",
    level: userProfile.level || 1,
    xp: userProfile.xp || 0,
    xpToNextLevel: 0,
    rank: "0",
    streak: 0
  };

  const stats = [
    { label: "Quizzes Taken", value: "52", icon: Brain, color: "text-primary" },
    { label: "Average Score", value: "91.2%", icon: Target, color: "text-success" },
    { label: "Total XP", value: "2,720", icon: Star, color: "text-warning" },
    { label: "Global Rank", value: "#2", icon: Trophy, color: "text-secondary" }
  ];

  const recentQuizzes = [
    {
      id: "1",
      title: "JavaScript Fundamentals",
      score: 95,
      totalQuestions: 20,
      timeCompleted: "2h ago",
      difficulty: "Beginner",
      topic: "Programming"
    },
    {
      id: "2",
      title: "React Hooks Deep Dive",
      score: 88,
      totalQuestions: 15,
      timeCompleted: "1d ago",
      difficulty: "Advanced",
      topic: "Programming"
    },
    {
      id: "3",
      title: "World Geography",
      score: 92,
      totalQuestions: 25,
      timeCompleted: "2d ago",
      difficulty: "Intermediate",
      topic: "Geography"
    }
  ];

  const badges = [
    { name: "First Quiz", description: "Completed your first quiz", earned: true, icon: "🎯" },
    { name: "Speed Runner", description: "Completed a quiz in under 5 minutes", earned: true, icon: "⚡" },
    { name: "Perfectionist", description: "Scored 100% on a quiz", earned: true, icon: "💯" },
    { name: "Streak Master", description: "Maintained a 7-day streak", earned: true, icon: "🔥" },
    { name: "Knowledge Seeker", description: "Completed 50 quizzes", earned: true, icon: "📚" },
    { name: "Quiz Creator", description: "Created your first quiz", earned: false, icon: "✨" }
  ];

  const recommendations = [
    {
      id: "1",
      title: "Advanced TypeScript",
      difficulty: "Advanced",
      topic: "Programming",
      reason: "Based on your JavaScript performance"
    },
    {
      id: "2",
      title: "CSS Grid & Flexbox",
      difficulty: "Intermediate",
      topic: "Web Development",
      reason: "Popular among developers"
    },
    {
      id: "3",
      title: "European History",
      difficulty: "Intermediate",
      topic: "History",
      reason: "Trending this week"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success text-success-foreground";
      case "Intermediate": return "bg-warning text-warning-foreground";
      case "Advanced": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-primary text-white text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Ready to continue your learning journey?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/quiz">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Take Quiz
                </Link>
              </Button>
              <Button variant="gradient" asChild>
                <Link to="/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="bg-gradient-card border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Quizzes
                      </CardTitle>
                      <CardDescription>Your latest quiz attempts and scores</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/quiz">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                            <Brain className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{quiz.title}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Badge variant="secondary">{quiz.topic}</Badge>
                              <Badge className={getDifficultyColor(quiz.difficulty)}>
                                {quiz.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">{quiz.score}%</div>
                          <div className="text-sm text-muted-foreground">
                            {quiz.score}/{quiz.totalQuestions} • {quiz.timeCompleted}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>Quizzes tailored to your interests and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((quiz) => (
                      <div key={quiz.id} className="p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                        <div className="space-y-3">
                          <div>
                            <div className="font-semibold">{quiz.title}</div>
                            <div className="text-sm text-muted-foreground">{quiz.reason}</div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{quiz.topic}</Badge>
                            <Badge className={getDifficultyColor(quiz.difficulty)}>
                              {quiz.difficulty}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Start Quiz
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-card border-0 shadow-md">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">Level {user.level}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.xp} / {user.xpToNextLevel} XP
                    </div>
                  </div>
                  <Progress value={(user.xp / user.xpToNextLevel) * 100} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Current XP: {user.xp}</span>
                    <span>{user.xpToNextLevel - user.xp} XP to go</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Streak Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    🔥 Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-orange-500 mb-2">{user.streak}</div>
                  <div className="text-sm text-muted-foreground mb-4">days in a row</div>
                  <Button variant="gradient" size="sm" className="w-full">
                    Continue Streak
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Badges
                    </CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/achievements">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {badges.slice(0, 6).map((badge, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-center transition-all duration-200 ${
                          badge.earned 
                            ? 'bg-gradient-primary text-white shadow-glow' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="text-xl mb-1">{badge.icon}</div>
                        <div className="text-xs font-medium">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/leaderboard">
                      <Trophy className="h-4 w-4 mr-2" />
                      View Leaderboard
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/profile">
                      <Users className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/analytics">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;