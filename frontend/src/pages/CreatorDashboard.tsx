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
  Plus,
  Eye,
  Users,
  BarChart3,
  Edit,
  Share2,
  Settings
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

const CreatorDashboard = () => {
  const { user } = useAuth();
  
  // Mock creator data
  const creatorData = {
    name: user?.user_metadata?.name || "Quiz Creator",
    avatar: "",
    totalQuizzes: 24,
    totalAttempts: 1420,
    avgRating: 4.8,
    totalRevenue: 2500
  };

  const stats = [
    { label: "Quizzes Created", value: "24", icon: Brain, color: "text-primary" },
    { label: "Total Attempts", value: "1,420", icon: Users, color: "text-success" },
    { label: "Average Rating", value: "4.8★", icon: Trophy, color: "text-warning" },
    { label: "Monthly Revenue", value: "$2.5k", icon: TrendingUp, color: "text-secondary" }
  ];

  const recentQuizzes = [
    {
      id: "1",
      title: "Advanced React Concepts",
      attempts: 89,
      rating: 4.9,
      status: "Published",
      createdAt: "2 days ago",
      category: "Programming"
    },
    {
      id: "2", 
      title: "Machine Learning Basics",
      attempts: 156,
      rating: 4.7,
      status: "Published",
      createdAt: "1 week ago",
      category: "AI/ML"
    },
    {
      id: "3",
      title: "Web Design Principles",
      attempts: 12,
      rating: 4.6,
      status: "Draft",
      createdAt: "3 days ago",
      category: "Design"
    }
  ];

  const analytics = [
    { metric: "Most Popular Quiz", value: "JavaScript Fundamentals", change: "+23%" },
    { metric: "Best Performing Category", value: "Programming", change: "+15%" },
    { metric: "Average Completion Rate", value: "87%", change: "+5%" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-success text-success-foreground";
      case "Draft": return "bg-warning text-warning-foreground";
      case "Archived": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Creator Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src={creatorData.avatar} />
                <AvatarFallback className="bg-gradient-primary text-white text-xl">
                  {creatorData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {creatorData.name}!</h1>
                <p className="text-muted-foreground">Ready to create amazing quizzes?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
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

            {/* Recent Quizzes */}
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
                        <Brain className="h-5 w-5 text-primary" />
                        Your Quizzes
                      </CardTitle>
                      <CardDescription>Manage and track your quiz performance</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/my-quizzes">View All</Link>
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
                              <Badge variant="secondary">{quiz.category}</Badge>
                              <Badge className={getStatusColor(quiz.status)}>
                                {quiz.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">{quiz.attempts} attempts</div>
                            <div className="text-sm text-muted-foreground">
                              {quiz.rating}★ • {quiz.createdAt}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Performance Insights
                  </CardTitle>
                  <CardDescription>Key metrics for your quiz content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analytics.map((item, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">{item.metric}</div>
                        <div className="text-xl font-bold">{item.value}</div>
                        <div className="text-sm text-success">{item.change}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="gradient" className="w-full justify-start" asChild>
                    <Link to="/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Quiz
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/analytics">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/my-quizzes">
                      <Brain className="h-4 w-4 mr-2" />
                      Manage Quizzes
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/profile">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gradient-card border-0 shadow-md">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">${creatorData.totalRevenue}</div>
                  <div className="text-sm text-muted-foreground mb-4">+12% from last month</div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-2">75% of monthly goal</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Quiz */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Top Performing Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold">JavaScript Fundamentals</div>
                      <div className="text-sm text-muted-foreground">Programming • Advanced</div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Attempts: 234</span>
                      <span className="text-primary">Rating: 4.9★</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatorDashboard;