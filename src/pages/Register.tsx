import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust as needed
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Mail, User, UserPlus, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input.js";
import type { AuthContextType } from "@/interfaces/AuthContextType";

// 1. Define form schema and type
const formSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Not a valid email." }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    role: z.enum(["user", "admin"], {
      errorMap: () => ({ message: "Please select a role." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;




// 3. Register component
const Register = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth() as AuthContextType;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        name: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      await axios.post("/users/users/register", payload);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: string }).message;
    toast.error(message);
  } else {
    toast.error('An unknown error occurred');
  }
} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-300 via-indigo-200 to-purple-300 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="px-8 pt-8 pb-10">
            <div className="flex flex-col items-center mb-8">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <UserPlus className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-1">Join our community today</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            className="pl-10 py-5 rounded-xl"
                            placeholder="john_doe"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            className="pl-10 py-5 rounded-xl"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pl-10 py-5 rounded-xl"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 py-5 rounded-xl"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <div
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role Field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="py-5 rounded-xl">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  className="w-full py-6 mt-2 rounded-xl text-white font-medium shadow-md bg-gradient-to-r from-blue-500 to-indigo-600"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">Already have an account?</p>
              <Link
                className="mt-2 inline-block font-medium text-indigo-600 hover:text-indigo-500"
                to="/login"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
