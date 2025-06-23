// context/AuthContext.tsx
import type { AuthContextType } from "@/interfaces/AuthContextType";

import type User from "@/interfaces/User";

import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode, useMemo,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const response = await axios.get<User>("/users/general/user", {
        withCredentials: true,
      });
      setUser(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);
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
        await axios.get("/users/users/logout", { withCredentials: true });
        toast.success("Logout successfully");
        setUser(null);
        localStorage.removeItem("jwt_token");
        navigate("/login");
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
    
  const serverMessage = err.response?.data?.message ?? 'Server error occurred';
  toast.error(serverMessage);
      }
    };
    helper();
  };

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ user, setUser, loading, logout, fetchDetails }),
        [user, loading, logout, fetchDetails] // update this list as needed
      )}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
