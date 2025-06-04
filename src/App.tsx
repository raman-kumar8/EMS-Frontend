
import {  Route, Routes } from "react-router"
import Register from './pages/Register'
import Login from "./pages/Login"

import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import TaskPage from "./pages/TaskPage"
import NotFound from "./pages/NotFound"
import ReportPage from "./pages/ReportPage"
import AboutUs from "./pages/AboutUs"
import {Leave} from "./pages/Leave"
import ForgetPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"
import HomePage from "./pages/HomePage"

const App = () => {
    return <>
     
     <Routes>

      <Route path='/' element = {
        <ProtectedRoute>
            <HomePage/>
        </ProtectedRoute>
      } />

      <Route path="/task" element = {
        <ProtectedRoute>
            <TaskPage/>
        </ProtectedRoute>
      }/>
      <Route path="/report" element = {
        <ProtectedRoute>
            <ReportPage/>
        </ProtectedRoute>
      }/>
      <Route path="/about" element={
        <ProtectedRoute>
          <AboutUs/>
        </ProtectedRoute>
      }/>
       
       <Route path="/leave" element={
         <ProtectedRoute>
           <Leave/>
         </ProtectedRoute>
       }/>
 
      <Route path="*" element={<NotFound/>}/>
       <Route path="/forget" element={<ForgetPassword/>}/>
       <Route path="/reset-password" element={<ResetPassword/>}/>
     <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        
        
        </Routes>   
    
    </>
}

export default App