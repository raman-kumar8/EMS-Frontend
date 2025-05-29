import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, LogIn } from "lucide-react"; 
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Not a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.enum(["user", "admin"], {
    errorMap: () => ({ message: "Please select a role." }),
  }),
});

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!loading && user) {
      if (user.role=="admin") {
  navigate("/admin");
} else {
  navigate("/");
}
    }
  }, [user, loading, navigate]);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        email: data.email,
        password: data.password,
      };
      

      // Login (sets cookie)
    const r1 =   await axios.post(`/users/users/login`, payload, {
        withCredentials: true,
      });
    
       
      // Immediately fetch user info
      const userRes = await axios.get(`/users/general/user`, {
        withCredentials: true,
      });
    

      // Update context
      setUser(userRes.data);
      toast.success("Login successful!");
      


// Redirect based on role
if (userRes.data.role == "admin") {
  navigate("/admin");
} else {
  navigate("/");
}
    


    } catch (error) {

     
      toast.error(error?.response?.data?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-300 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="px-8 pt-8 pb-10">
            {/* Logo and Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <LogIn className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-1">Sign in to your account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-10 py-6 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                        <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="py-6 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            {...field}
                          />
                        </FormControl>
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full py-6 rounded-xl text-white font-medium shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg hover:opacity-95"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?
              </p>
              <Link 
                className="mt-2 inline-block font-medium text-indigo-600 hover:text-indigo-500" 
                to="/register"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
        
        {/* Additional info footer */}
        <p className="text-center text-xs text-gray-500 mt-4">
          subject to the Privacy Policy and Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Login;