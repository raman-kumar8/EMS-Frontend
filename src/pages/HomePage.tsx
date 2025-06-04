import { useAuth } from "@/context/AuthContext"
import type { AuthContextType } from "@/interfaces/AuthContextType";
import Home from "./Home";
import Admin from "./Admin";

const HomePage = () => {
  const {user,loading,} = useAuth() as AuthContextType;

  return <>
     {(!loading && user?.role=="user")? <Home/> :<Admin/>}
  </>
}

export default HomePage