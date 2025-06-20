import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext.js";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner.js";
interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute:React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">
      <LoadingSpinner/>
    </div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
