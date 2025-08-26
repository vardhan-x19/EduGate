import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Calendar,
  Users,
  Target,
  Award,
  Star,
  Flame
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all-time");
  const [selectedQuiz, setSelectedQuiz] = useState("all");

  // Mock leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "",
      score: 2850,
      accuracy: 94.5,
      quizzesCompleted: 47,
      streak: 12,
      badge: "Quiz Master",
      change: "up"
    },
    {
      rank: 2,
      name: "Alex Rodriguez",
      avatar: "",
      score: 2720,
      accuracy: 91.2,
      quizzesCompleted: 52,
      streak: 8,
      badge: "Knowledge Seeker",
      change: "up"
    },
    {
      rank: 3,
      name: "Maya Patel",
      avatar: "",
      score: 2680,
      accuracy: 89.8,
      quizzesCompleted: 38,
      streak: 15,
      badge: "Rising Star",
      change: "down"
    },
    {
      rank: 4,
      name: "David Kim",
      avatar: "",
      score: 2590,
      accuracy: 88.3,
      quizzesCompleted: 41,
      streak: 6,
      badge: "Consistent Learner",
      change: "up"
    },
    {
      rank: 5,
      name: "Emma Wilson",
      avatar: "",
      score: 2480,
      accuracy: 87.9,
      quizzesCompleted: 35,
      streak: 9,
      badge: "Quick Learner",
      change: "same"
    },
    {
      rank: 6,
      name: "James Thompson",
      avatar: "",
      score: 2360,
      accuracy: 86.4,
      quizzesCompleted: 44,
      streak: 4,
      badge: "Dedicated Student",
      change: "up"
    },
    {
      rank: 7,
      name: "Lisa Zhang",
      avatar: "",
      score: 2290,
      accuracy: 85.7,
      quizzesCompleted: 29,
      streak: 7,
      badge: "Fast Climber",
      change: "up"
    },
    {
      rank: 8,
      name: "Michael Brown",
      avatar: "",
      score: 2180,
      accuracy: 84.2,
      quizzesCompleted: 33,
      streak: 3,
      badge: "Steady Progress",
      change: "down"
    }
  ];

  const topPerformers = [
    { category: "Highest Accuracy", name: "Sarah Chen", value: "94.5%", icon: Target },
    { category: "Most Quizzes", name: "Alex Rodriguez", value: "52", icon: Users },
    { category: "Longest Streak", name: "Maya Patel", value: "15 days", icon: Flame },
    { category: "This Week's Star", name: "Lisa Zhang", value: "+340 pts", icon: Star }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Leaderboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Compete with learners worldwide and climb the rankings.
          </p>
        </motion.div>

        {/* Top Performers Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {topPerformers.map((performer, index) => (
            <Card key={index} className="bg-gradient-card border-0 shadow-md">
              <CardContent className="p-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary mx-auto mb-3">
                  <performer.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm text-muted-foreground mb-1">{performer.category}</div>
                <div className="font-semibold">{performer.name}</div>
                <div className="text-lg font-bold text-primary">{performer.value}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>Customize the leaderboard view</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all-time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quiz Category</label>
                  <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quizzes</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="geography">Geography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <CardTitle>Global Rankings</CardTitle>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {selectedPeriod === "all-time" ? "All Time" : 
                     selectedPeriod === "month" ? "This Month" :
                     selectedPeriod === "week" ? "This Week" : "Today"}
                  </Badge>
                </div>
                <CardDescription>
                  Top performers based on quiz scores and accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((user, index) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        user.rank <= 3 ? 'bg-gradient-card border-primary/20' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(user.rank)}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.badge}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className="text-lg font-bold text-primary">{user.score.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                        <div>
                          <div className="font-semibold">{user.accuracy}%</div>
                          <div className="text-xs text-muted-foreground">accuracy</div>
                        </div>
                        <div>
                          <div className="font-semibold">{user.quizzesCompleted}</div>
                          <div className="text-xs text-muted-foreground">quizzes</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold flex items-center gap-1">
                              <Flame className="h-4 w-4 text-orange-500" />
                              {user.streak}
                            </div>
                            <div className="text-xs text-muted-foreground">streak</div>
                          </div>
                          {getChangeIcon(user.change)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Load More Rankings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievement Spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-card border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Join the Competition!</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Take quizzes to earn points, climb the leaderboard, and compete with learners from around the world. 
                The more you learn, the higher you'll rise!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="gradient" size="lg">
                  Start Taking Quizzes
                </Button>
                <Button variant="outline" size="lg">
                  View Your Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Leaderboard;