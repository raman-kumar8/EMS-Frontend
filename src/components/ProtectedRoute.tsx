import React, { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext.js";
import { Navigate } from "react-router-dom";
import Header from "./Header.js";
import Footer from "./Footer.js";
import LoadingSpinner from "./LoadingSpinner.js";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <LoadingSpinner/>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main grows and pushes footer down */}
      <main className="flex-grow min-h-[calc(100vh-160px)]">{children}</main>

      {/* Footer with max height and responsive padding */}
      <Footer />
    </div>
  );
};

export default ProtectedRoute;
