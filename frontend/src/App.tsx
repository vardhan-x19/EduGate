// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Quiz from "./pages/Quiz";
// import Create from "./pages/Create";
// import Leaderboard from "./pages/Leaderboard";
// import Dashboard from "./pages/Dashboard";
// import NotFound from "./pages/NotFound";
// import {useEffect,useState} from "react";
// const queryClient = new QueryClient();
// import { useSelector, } from "react-redux";
// import { useDispatch } from "react-redux";
// import { login } from "./store/userLogin";
// // Wrap the App with Redux Provider and pass the store
// import axios from "axios";
// const App = () => {
//   const isLogin = useSelector((state) => state.user.isLoggedIn);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     axios.get("http://localhost:5000/users/profile")
//       .then(response => {
//         dispatch(login(response.data.token));
//         console.log("Data fetched successfully:", response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching data:", error);
//       });
//   }, [/* dependencies */]);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           {isLogin ? <Route path="/" element={<Landing />} /> : <Route path="/" element={<Login />} />}
//             {isLogin ? (
//             <>
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/quiz" element={<Quiz />} />
//               <Route path="/create" element={<Create />} />
//               <Route path="/leaderboard" element={<Leaderboard />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//             </>
//             ) : (
//             <>
//               {/* Only allow access to Login page if not logged in */}
//               <Route path="/signup" element={<Login />} />
//               <Route path="/quiz" element={<Login />} />
//               <Route path="/create" element={<Login />} />
//               <Route path="/leaderboard" element={<Login />} />
//               <Route path="/dashboard" element={<Login />} />
//             </>
//             )}
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );
// }
// export default App;




import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Quiz from "./pages/Quiz";
import Create from "./pages/Create";
import Leaderboard from "./pages/Leaderboard";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
const queryClient = new QueryClient();
import { useSelector, useDispatch } from "react-redux";
import { login } from "./store/user";
import axios from "axios";
import QuizPlay from "./pages/QuizPlay";
// import Navbar from "./components/Navbar"; // Assuming you have a Navbar component

const App = () => {
  const isLogin = useSelector((state: any) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    const quizToken = localStorage.getItem("quiztoken");
    axios.get("http://localhost:5000/users/profile", {
      headers: {
        Authorization: `Bearer ${quizToken}`,
      },
    })
      .then(response => {
        dispatch(login({ token: response.data.token, user: response.data.user }));
        console.log("Data fetched successfully:", response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        
          <Routes>

            {!isLogin ? (
              <>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* Redirect all other routes to Login */}
                <Route path="*" element={<Login />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Landing />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/create" element={<Create />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/quiz/:id/play" element={<QuizPlay />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

