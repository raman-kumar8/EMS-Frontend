import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext.js";
import { Navigate } from "react-router-dom";
interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute:React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
