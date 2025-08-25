import { Link } from "react-router-dom";
import { Brain, Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">QuizMaster</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered quiz platform for learning, teaching, and competing.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <nav className="space-y-2">
              <Link to="/quiz" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Take Quiz
              </Link>
              <Link to="/create" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Create Quiz
              </Link>
              <Link to="/leaderboard" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Leaderboard
              </Link>
              <Link to="/analytics" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Analytics
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <nav className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                About
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Privacy
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Terms
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-smooth">
                Contact
              </a>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 QuizMaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;