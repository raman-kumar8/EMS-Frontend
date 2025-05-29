import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

 if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

 
  if (!user) {
    return <Navigate to="/login" />;
  }
  if ( user.role != "admin") {
    return <Navigate to="/" replace />;
  }

  // If admin, render children
  return <>{children}</>;
};

export default AdminRoute;
