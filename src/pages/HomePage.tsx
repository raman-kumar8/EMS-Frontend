import { useAuth } from "@/context/AuthContext"

import Home from "./Home";
import Admin from "./Admin";

const HomePage = () => {
  const {user,loading,} = useAuth();

  return <>
     {(!loading && user?.role=="user")? <Home/> :<Admin/>}
  </>
}

export default HomePage