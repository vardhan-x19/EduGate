import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Trophy, 
  BarChart3, 
  Gamepad2, 
  Zap, 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Landing = () => {
  
  const features = [
    {
      icon: Brain,
      title: "AI Quiz Generation",
      description: "Create quizzes instantly with AI-powered question generation from any topic."
    },
    {
      icon: Trophy,
      title: "Real-time Leaderboard",
      description: "Compete with others and climb the rankings in real-time competitions."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track your progress with detailed performance analytics and insights."
    },
    {
      icon: Gamepad2,
      title: "Gamification",
      description: "Earn badges, unlock achievements, and level up your learning journey."
    }
  ];

  const benefits = [
    "Generate unlimited quizzes with AI",
    "Real-time multiplayer competitions",
    "Comprehensive progress tracking",
    "Custom quiz creation tools",
    "Achievement system & badges",
    "Detailed performance analytics"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary-light/20 to-secondary-light/20">
        <div className="container py-20 lg:py-32">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Learning Platform
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Master Knowledge with{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AI-Powered Quizzes
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create, take, and master quizzes with intelligent question generation, 
                real-time competitions, and comprehensive analytics.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button size="lg" variant="hero" className="text-lg px-8 py-4" asChild>
                <Link to="/quiz">
                  Take a Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link to="/create">Create Quiz</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Quizzes Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1M+</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold mb-6">
              Everything you need to{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                excel in learning
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
              Powerful features designed to make learning engaging, competitive, and effective.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover-lift bg-gradient-card border-0 shadow-md">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why choose{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  QuizMaster?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of learners and educators who are already using our platform 
                to enhance their knowledge and teaching capabilities.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="bg-gradient-card border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-0 shadow-md mt-6">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-success mx-auto mb-3" />
                  <div className="text-2xl font-bold text-success">95%</div>
                  <div className="text-sm text-muted-foreground">Improvement Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-0 shadow-md -mt-6">
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-warning mx-auto mb-3" />
                  <div className="text-2xl font-bold text-warning">2 sec</div>
                  <div className="text-sm text-muted-foreground">AI Generation</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-secondary">1M+</div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to start your{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                learning journey?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of learners and start creating amazing quizzes today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="hero" className="text-lg px-8 py-4" asChild>
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                <Link to="/quiz">Explore Quizzes</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;