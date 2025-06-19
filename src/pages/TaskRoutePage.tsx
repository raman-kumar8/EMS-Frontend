import { useAuth } from "@/context/AuthContext"
import type { AuthContextType } from "@/interfaces/AuthContextType";
import TaskAdminPage from "./TaskAdminPage";
import TaskPage from "./TaskPage";
import { Loader } from "lucide-react";

const TaskRoutePage = () => {
    const {user,loading} = useAuth() as AuthContextType;
    
  return (
    <>
       
      {loading? <>
       
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="flex items-center gap-3 text-blue-600">
                <Loader size={24} className="animate-spin" />
                <span className="text-lg font-medium">Loading reports...</span>
              </div>
            </div>
        
      
      </>
      :<>
         {user?.role==='admin' ? <TaskAdminPage/> : <TaskPage/>}
      </>}
    </>
  )
}

export default TaskRoutePage