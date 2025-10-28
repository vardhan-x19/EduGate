import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Users,
  Trophy,
  Brain,
  Code,
  Palette,
  Globe,
  BookOpen,
  Filter,
  Search,
  Play,
  Lock,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setQuizzes } from "@/store/quizz";
const Quiz = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading,setIsLoading]=useState(true);
  const [quizzes, setvalues] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get("http://localhost:5000/quiz/all")
      .then((response) => {
        // Dispatch the fetched quizzes to the Redux store
        console.log("the data", response.data, typeof response.data.quizzes);
        dispatch(setQuizzes(response.data));
        setvalues(response.data.quizzes);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, []);
  // const values = useSelector((state: any) => state.quizzes);
  // console.log('values',values)
  // console.log('values ',values,typeof(values));
  // console.log("Quizzes from Redux store:", values.quizzes);
  // const quizzes = [
  //   {
  //     id: "1",
  //     title: "JavaScript Fundamentals",
  //     description: "Test your knowledge of core JavaScript concepts including variables, functions, and objects.",
  //     topic: "Programming",
  //     difficulty: "Beginner",
  //     timeLimit: 15,
  //     questions: 20,
  //     participants: 1245,
  //     icon: Code,
  //     isPrivate: false,
  //     creator: "Tech Academy"
  //   },
  //   {
  //     id: "2",
  //     title: "React Hooks Deep Dive",
  //     description: "Advanced quiz on React hooks, custom hooks, and modern React patterns.",
  //     topic: "Programming",
  //     difficulty: "Advanced",
  //     timeLimit: 25,
  //     questions: 15,
  //     participants: 892,
  //     icon: Code,
  //     isPrivate: false,
  //     creator: "React Masters"
  //   }
  // ]
  console.log("quizzes",quizzes, typeof(quizzes))

  const topics = [
    "all",
    "Programming",
    "Geography",
    "Art",
    "Mathematics",
    "Technology",
  ];
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"];
  var filteredQuizzes=[];
  if (quizzes) {
    filteredQuizzes = quizzes.filter((quiz: any) => {
      const title = (quiz.title || "").toString();
      const desc = (quiz.description || "").toString();
      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTopic =
        selectedTopic === "all" || quiz.topic === selectedTopic;
      const matchesDifficulty =
        selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;

      return matchesSearch && matchesTopic && matchesDifficulty;
    });
  }

  // map of icon name (string) to React component
  const iconMap: Record<string, any> = {
    Code,
    Globe,
    Palette,
    BookOpen,
    Brain,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success text-success-foreground";
      case "Intermediate":
        return "bg-warning text-warning-foreground";
      case "Advanced":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
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
            Explore{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Quizzes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Challenge yourself with thousands of quizzes across various topics
            and difficulty levels.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic === "all" ? "All Topics" : topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === "all" ? "All Levels" : difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quiz Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredQuizzes.map((quiz: any, index: number) => {
            const key = quiz.id || quiz._id || index;
            const IconComponent = quiz.icon && iconMap[quiz.icon] ? iconMap[quiz.icon] : Code;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover-lift bg-gradient-card border-0 shadow-md group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {quiz.isPrivate && (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Private
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{quiz.topic}</Badge>
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.timeLimit ?? 0}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4" />
                        <span>{(quiz.questions?.length ?? 0)}q</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{(quiz.participants ?? 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Created by {quiz.creator || 'Unknown'}
                    </div>

                    <Button
                      className="w-full group-hover:shadow-glow transition-all duration-300"
                      variant={quiz.isPrivate ? "outline" : "gradient"}
                      asChild
                    >
                      <Link to={`/quiz/${quiz.id || quiz._id}/play`}>
                        <Play className="h-4 w-4 mr-2" />
                        {quiz.isPrivate ? "Enter Code" : "Start Quiz"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Results */}
        {filteredQuizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters.
            </p>
            <Button variant="gradient" asChild>
              <Link to="/create">Create Your Own Quiz</Link>
            </Button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="p-8 bg-gradient-card border-0 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-muted-foreground mb-6">
              Create your own quiz with our AI-powered quiz generator or custom
              quiz builder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link to="/create">Create New Quiz</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  
    
  );
};

export default Quiz;
