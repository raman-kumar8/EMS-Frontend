import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
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
