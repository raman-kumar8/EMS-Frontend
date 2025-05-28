import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import Header from "./Header.js";
import Footer from "./Footer.js";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
   
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main grows and pushes footer down */}
      <main className="flex-grow min-h-[calc(100vh-160px)]">
        {children}
      </main>

      {/* Footer with max height and responsive padding */}
      <Footer />
    </div>
  );
};


export default ProtectedRoute;
