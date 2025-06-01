import {Button} from "@/components/ui/button.js";
import React from "react";

const HomePage = ({user, logout}) => {
    return<>
    <h2>User Details</h2>
    <p>Name:{user.name}</p>
    <p>Email:{user.email}</p>
    <p>Role:{user.role}</p>
    <Button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white">Logout</Button>
    
    
    
    
    
    </>
}
export default HomePage;