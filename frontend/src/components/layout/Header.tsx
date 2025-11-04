import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Brain, User, Trophy } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/user";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isLogin = useSelector((state: any) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state: any) => state.user.user);
  const role = userProfile.role;
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Take Quiz", href: "/quiz" },
    // show Create Quiz for everyone in the nav, but restrict action to teachers
    { name: "Create Quiz", href: "/create", teacherOnly: true },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Dashboard", href: "/dashboard" },
  ];
   
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    // Call your logout API here
    await fetch("http://localhost:5000/logout", { method: "POST", credentials: "include" });
    dispatch(logout());
    localStorage.removeItem("quiztoken");
    navigate("/login");
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // if teacher, navigate to /create, else show modal
    if (role && typeof role === "string" && role.toLowerCase() === "teacher") {
      navigate("/create");
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-smooth">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">QuizMaster</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            item.name === "Create Quiz" ? (
              <button
                key={item.name}
                onClick={handleCreateClick}
                className={`text-sm font-medium transition-smooth hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-smooth hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isLogin ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
          {!isLogin && (
            <Button variant="gradient" size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
        transition={{ duration: 0.2 }}
        className="md:hidden overflow-hidden border-t bg-background"
      >
        <div className="container py-4 space-y-3">
          {navigation.map((item) => (
            item.name === "Create Quiz" ? (
              <button
                key={item.name}
                onClick={() => { setIsMenuOpen(false); handleCreateClick(); }}
                className={`block w-full text-left py-2 text-sm font-medium transition-smooth hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`block py-2 text-sm font-medium transition-smooth hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          ))}
          <div className="pt-3 border-t space-y-2">
            {isLogin ? (
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
                <User className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button variant="gradient" className="w-full" asChild>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
      {/* Create-Only-Teachers Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 top-7 flex items-center justify-center">
          <div className="absolute inset-0 " onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Teacher Access Required</h3>
            <p className="text-sm text-muted-foreground mb-4">Only users with the "teacher" role can create quizzes. If you are an instructor, please contact your administrator to upgrade your account.</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;