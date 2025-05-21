import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // new

  const navigate = useNavigate();

useEffect(() => {
  const fetchDetails = async () => {
    try {
      const userDetails = await axios.get(
        `${import.meta.env.VITE_USER_URL}/general/user`,
        { withCredentials: true }
      );
      setUser(userDetails.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false); // ✅ done loading, success or fail
    }
  };
  fetchDetails();
}, []);

  
  const logout =()=>{
    const helper  = async()=>{
      try {
        const response = await axios.get(`${import.meta.env.VITE_USER_URL}/users/logout`,{withCredentials:true});
      toast.success("logout Succesfully");
      setUser(null);
      console.log(response);
      navigate("/login");
      } catch (error) {
        console.log(error)
      }
    }
    helper();

  } ;

  return (
    <AuthContext.Provider value={{ user,setUser, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
