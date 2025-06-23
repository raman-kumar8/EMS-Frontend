import { useAuth } from "@/context/AuthContext"

import TaskAdminPage from "./TaskAdminPage";
import TaskPage from "./TaskPage";


const TaskRoutePage = () => {
    const {user} = useAuth();
    
  return (
    
      <>
         {user?.role==='admin' ? <TaskAdminPage/> : <TaskPage/>}
      </>
    
  )
}

export default TaskRoutePage