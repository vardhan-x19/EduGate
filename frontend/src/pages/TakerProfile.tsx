import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  Target, 
  Clock, 
  Brain, 
  Award, 
  Star,
  Calendar,
  TrendingUp,
  Edit,
  Save,
  Camera
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const TakerProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data - would come from database
  const userData = {
    name: user?.user_metadata?.name || "Quiz Taker",
    email: user?.email || "",
    avatar: "",
    level: 12,
    xp: 2720,
    xpToNextLevel: 3000,
    totalQuizzes: 52,
    averageScore: 91.2,
    streak: 8,
    joinedDate: "January 2024",
    favoriteCategory: "Programming",
    achievements: 15
  };

  const stats = [
    { label: "Quizzes Completed", value: userData.totalQuizzes, icon: Brain, color: "text-primary" },
    { label: "Average Score", value: `${userData.averageScore}%`, icon: Target, color: "text-success" },
    { label: "Current Streak", value: `${userData.streak} days`, icon: Calendar, color: "text-warning" },
    { label: "Achievements", value: userData.achievements, icon: Award, color: "text-secondary" }
  ];

  const recentAchievements = [
    { name: "Speed Runner", description: "Complete a quiz in under 5 minutes", icon: "⚡", date: "2 days ago" },
    { name: "Perfectionist", description: "Score 100% on a quiz", icon: "💯", date: "1 week ago" },
    { name: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥", date: "2 weeks ago" },
    { name: "Knowledge Seeker", description: "Complete 50 quizzes", icon: "📚", date: "3 weeks ago" }
  ];

  const categoryStats = [
    { category: "Programming", completed: 18, average: 94.2, color: "bg-primary" },
    { category: "Science", completed: 12, average: 87.5, color: "bg-success" },
    { category: "History", completed: 8, average: 89.1, color: "bg-warning" },
    { category: "Literature", completed: 6, average: 92.3, color: "bg-secondary" },
    { category: "Mathematics", completed: 8, average: 95.8, color: "bg-destructive" }
  ];

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold">{userData.name}</h1>
                      <p className="text-muted-foreground">{userData.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">Level {userData.level}</Badge>
                        <Badge className="bg-gradient-primary text-white">Quiz Enthusiast</Badge>
                      </div>
                    </div>
                    <Button
                      variant={isEditing ? "gradient" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="md:ml-auto"
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Joined</div>
                      <div className="font-semibold">{userData.joinedDate}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Favorite Category</div>
                      <div className="font-semibold">{userData.favoriteCategory}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">XP Progress</div>
                      <div className="font-semibold">{userData.xp} / {userData.xpToNextLevel} XP</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Edit Profile Form */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile Information</CardTitle>
                    <CardDescription>Update your personal details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={userData.name} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={userData.email} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" placeholder="Tell us about yourself..." />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Category Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance by Category
                  </CardTitle>
                  <CardDescription>Your quiz performance across different topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <div>
                            <div className="font-semibold">{category.category}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.completed} quizzes completed
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">{category.average}%</div>
                          <div className="text-sm text-muted-foreground">Average Score</div>
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
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-card border-0 shadow-md">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">Level {userData.level}</div>
                    <div className="text-sm text-muted-foreground">
                      {userData.xp} / {userData.xpToNextLevel} XP
                    </div>
                  </div>
                  <Progress value={(userData.xp / userData.xpToNextLevel) * 100} className="h-3" />
                  <div className="text-center text-sm text-muted-foreground">
                    {userData.xpToNextLevel - userData.xp} XP until next level
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                          <div className="text-xs text-muted-foreground">{achievement.date}</div>
                        </div>
                      </div>
                    ))}
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

export default TakerProfile;