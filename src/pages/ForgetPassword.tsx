import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

import { useState } from "react";

import axios from "axios";
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
});

type ForgetPasswordFormValues = z.infer<typeof formSchema>;

const ForgetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgetPasswordFormValues> = async (data) => {
    try {
      setIsSubmitting(true);
      data.email = data.email.toLowerCase();
      await axios.post("/users/users/forget", data,{withCredentials:true}); 
      toast.success("Password reset link sent to your email.");
    }catch (error: unknown) {
      
  if (typeof error === 'object' && error !== null && 'message' in error) {
    
    const err = error as { response?: { data?: { message?: string } } };
    
  const serverMessage = err.response?.data?.message ?? 'Server error occurred';
  toast.error(serverMessage);
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
                <Send className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
              <p className="text-gray-500 mt-1 text-center">
                Enter your email address and we'll send you a link to reset your password.
              </p>
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 rounded-xl text-white font-medium shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg hover:opacity-95"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>Sending link...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">Remember your password?</p>
              <Link
                to="/login"
                className="mt-2 inline-block font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
