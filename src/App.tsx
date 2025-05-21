
import { BrowserRouter, Route, Routes } from "react-router"
import Register from './pages/Register'
import Login from "./pages/Login"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
const App = () => {
    return <>
   
     <Routes>
      <Route path='/' element = {
        <ProtectedRoute>
            <Home/>
        </ProtectedRoute>
      } />
     <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        
        
        </Routes>   
    
    </>
}

export default App