
import {useAuth} from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button.js";
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
  return (
    <div>
        {user?.email}
        <br />
        <Button className=" space-x-4 space-y-4 mt-8" onClick={()=>{
            logout();
        }}>Logou</Button>
    </div>
  )
}

export default Home