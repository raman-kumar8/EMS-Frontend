
import {useAuth} from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button.js";
import Admin from "./Admin";
import HomePage from "./HomePage.tsx";
const Home = () => {
// useEffect(()=>{
//  const helper = async()=>{
//      try {
//     const respone = await axios.get(`${import.meta.env.VITE_USER_URL}/general/validate`, {
//   withCredentials: true,
// });

//     console.log(respone);
//     toast.success(respone.data)
//  } catch (error) {
//    console.log(error)
//  }
//  }
//  helper();
// },[])
const {user,logout} =useAuth();
if(!user) {
  return <div>Loading or not logged in....</div>; 
}

return(
  <div>
    {user.role === "admin" ? (
      <Admin/>):(
        <div>
          <HomePage user={user} logout={logout} />

        </div>
      )}
    

  </div>
);

};



export default Home;