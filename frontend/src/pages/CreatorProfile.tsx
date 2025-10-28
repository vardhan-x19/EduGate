import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trophy, 
  Target, 
  Brain, 
  Award, 
  Star,
  TrendingUp,
  Edit,
  Save,
  Camera,
  BarChart3,
  Users,
  DollarSign,
  Calendar
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const CreatorProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock creator data - would come from database
  const creatorData = {
    name: user?.user_metadata?.name || "Quiz Creator",
    email: user?.email || "",
    avatar: "",
    bio: "Passionate educator creating engaging quizzes to help learners grow.",
    totalQuizzes: 24,
    totalAttempts: 1420,
    totalEarnings: 2500,
    avgRating: 4.8,
    joinedDate: "September 2023",
    specialization: "Programming & Technology",
    followers: 156
  };

  const stats = [
    { label: "Quizzes Created", value: creatorData.totalQuizzes, icon: Brain, color: "text-primary" },
    { label: "Total Attempts", value: creatorData.totalAttempts.toLocaleString(), icon: Users, color: "text-success" },
    { label: "Average Rating", value: `${creatorData.avgRating}★`, icon: Star, color: "text-warning" },
    { label: "Total Earnings", value: `$${creatorData.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-secondary" }
  ];

  const topQuizzes = [
    { title: "JavaScript Fundamentals", attempts: 234, rating: 4.9, earnings: 580 },
    { title: "React Hooks Deep Dive", attempts: 189, rating: 4.8, earnings: 445 },
    { title: "CSS Grid & Flexbox", attempts: 167, rating: 4.7, earnings: 392 },
    { title: "Python Basics", attempts: 145, rating: 4.6, earnings: 340 }
  ];

  const monthlyStats = [
    { month: "Nov", quizzes: 3, attempts: 156, earnings: 380 },
    { month: "Oct", quizzes: 2, attempts: 234, earnings: 520 },
    { month: "Sep", quizzes: 4, attempts: 189, earnings: 445 },
    { month: "Aug", quizzes: 1, attempts: 98, earnings: 230 }
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
                    <AvatarImage src={creatorData.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                      {creatorData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold">{creatorData.name}</h1>
                      <p className="text-muted-foreground">{creatorData.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-gradient-primary text-white">Quiz Creator</Badge>
                        <Badge variant="secondary">{creatorData.specialization}</Badge>
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
                  
                  <p className="text-muted-foreground mb-4">{creatorData.bio}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Joined</div>
                      <div className="font-semibold">{creatorData.joinedDate}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Followers</div>
                      <div className="font-semibold">{creatorData.followers.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Average Rating</div>
                      <div className="font-semibold">{creatorData.avgRating}★</div>
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
                    <CardDescription>Update your creator profile and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Creator Name</Label>
                        <Input id="name" defaultValue={creatorData.name} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={creatorData.email} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input id="specialization" defaultValue={creatorData.specialization} />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue={creatorData.bio} rows={3} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Top Performing Quizzes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Top Performing Quizzes
                  </CardTitle>
                  <CardDescription>Your most successful quiz content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topQuizzes.map((quiz, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-white font-bold">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{quiz.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {quiz.attempts} attempts • {quiz.rating}★ rating
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">${quiz.earnings}</div>
                          <div className="text-sm text-muted-foreground">earnings</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Monthly Performance
                  </CardTitle>
                  <CardDescription>Track your progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyStats.map((month, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-4 rounded-lg border">
                        <div className="text-center">
                          <div className="font-semibold">{month.month}</div>
                          <div className="text-sm text-muted-foreground">Month</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-primary">{month.quizzes}</div>
                          <div className="text-sm text-muted-foreground">Quizzes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-success">{month.attempts}</div>
                          <div className="text-sm text-muted-foreground">Attempts</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-secondary">${month.earnings}</div>
                          <div className="text-sm text-muted-foreground">Earnings</div>
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
            {/* Earnings Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-card border-0 shadow-md">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-3xl font-bold text-primary">${creatorData.totalEarnings.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">+12% from last month</div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Creator Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Creator Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl">🏆</div>
                  <div>
                    <div className="font-semibold text-lg">Elite Creator</div>
                    <div className="text-sm text-muted-foreground">Top 5% of creators</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground">Next milestone:</div>
                    <div className="font-semibold">Master Creator (50 quizzes)</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Quizzes</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quiz Attempts</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Followers</span>
                      <span className="font-semibold">+12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold text-primary">$380</span>
                    </div>
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

export default CreatorProfile;