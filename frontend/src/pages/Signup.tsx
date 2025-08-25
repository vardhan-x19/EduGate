import { useState } from "react";
import { motion } from "framer-motion";
import { Link, redirect } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Layout from "@/components/layout/Layout";
import axios from "axios";
import { error } from "console";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" // Default role changed
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://localhost:9000/users/register", formData)
      .then(respose => {
        console.log("Registration Processed:", respose.data);
        redirect("/login");
      }).catch(error => {
        console.error("Registration Error:", error.response?.data || error.message);
      })
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-primary-light/10 to-secondary-light/10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl border-0 bg-gradient-card">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Join QuizMaster</CardTitle>
                <CardDescription>
                  Create your account and start your learning journey
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>I am a</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* Student Option */}
                    <div
                      className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-smooth ${
                        formData.role === "student" ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="cursor-pointer flex-1">
                        <div className="font-medium">Student</div>
                        <div className="text-xs text-muted-foreground">Learn & compete</div>
                      </Label>
                    </div>

                    {/* Teacher Option */}
                    <div
                      className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition-smooth ${
                        formData.role === "teacher" ? "border-primary bg-primary/10" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value="teacher" id="teacher" />
                      <Label htmlFor="teacher" className="cursor-pointer flex-1">
                        <div className="font-medium">Teacher</div>
                        <div className="text-xs text-muted-foreground">Teach & share</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <Button type="submit" variant="gradient" className="w-full">
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline transition-smooth">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;