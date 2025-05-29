
import {  Route, Routes } from "react-router"
import Register from './pages/Register'
import Login from "./pages/Login"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import { Task } from "./pages/Task"
import NotFound from "./pages/NotFound"
import ReportPage from "./pages/ReportPage"
import AboutUs from "./pages/AboutUs"
const App = () => {
    return <>
     
     <Routes>

      <Route path='/' element = {
        <ProtectedRoute>
            <Home/>
        </ProtectedRoute>
      } />

      <Route path="/task" element = {
        <ProtectedRoute>
            <Task/>
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
 
      <Route path="*" element={<NotFound/>}/>
     <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        
        
        </Routes>   
    
    </>
}

export default App