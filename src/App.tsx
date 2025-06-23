
import {  Route, Routes } from "react-router"
import Register from './pages/Register'
import Login from "./pages/Login"

import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

import NotFound from "./pages/NotFound"
import ReportPage from "./pages/ReportPage"
import AboutUs from "./pages/AboutUs"
import LeavePage from "./pages/LeavePage"
import ForgetPassword from "./pages/ForgetPassword"
import ResetPassword from "./pages/ResetPassword"
import HomePage from "./pages/HomePage"
import TaskRoutePage from "./pages/TaskRoutePage"

const App = () => {
    return <div>
     
     <Routes>

      <Route path='/' element = {
        <ProtectedRoute>
            <HomePage/>
        </ProtectedRoute>
      } />

      <Route path="/task" element = {
        <ProtectedRoute>
            <TaskRoutePage/>
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
           <LeavePage/>
         </ProtectedRoute>
       }/>
 
      <Route path="*" element={<NotFound/>}/>
       <Route path="/forget" element={<ForgetPassword/>}/>
       <Route path="/reset-password" element={<ResetPassword/>}/>
     <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        
        
        </Routes>   
    
    </div>
}

export default App