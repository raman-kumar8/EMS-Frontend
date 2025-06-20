import { useAuth } from "@/context/AuthContext"
import type { AuthContextType } from "@/interfaces/AuthContextType";
import TaskAdminPage from "./TaskAdminPage";
import TaskPage from "./TaskPage";


const TaskRoutePage = () => {
    const {user} = useAuth() as AuthContextType;
    
  return (
    
      <>
         {user?.role==='admin' ? <TaskAdminPage/> : <TaskPage/>}
      </>
    
  )
}

export default TaskRoutePage