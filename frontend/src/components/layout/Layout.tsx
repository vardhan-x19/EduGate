import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  const isLogin = useSelector((state: any) => state.user.isLoggedIn);
  return (
    <div className="min-h-screen flex flex-col">
      {isLogin && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;