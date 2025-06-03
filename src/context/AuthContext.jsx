import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Move fetchDetails outside useEffect
  const fetchDetails = async () => {
    try {
      const userDetails = await axios.get(
        `/users/general/user`,
        { withCredentials: true }
      );
      setUser(userDetails.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const logout = () => {
    const helper = async () => {
      try {
        await axios.get(`/users/users/logout`, { withCredentials: true });
        toast.success("Logout successfully");
        setUser(null);
        localStorage.removeItem("jwt_token");
        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    };
    helper();
  };

  // ✅ Now fetchDetails is included in context
  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, fetchDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
