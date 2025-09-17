"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { loginUser } from "@/store/slices/authSlice/getAuthSlice";
import { CONSTANTS } from "@/lib/constants";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Loader2,
  Shield,
  CheckCircle,
  Clock,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const token = Cookies.get("userToken");
    if (token) router.push("/overview");
  }, [router]);

  const onSubmit = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      toast.success("Login successful!");
      router.push("/overview");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      <div className="absolute left-4 top-2 w-48 h-16 mx-auto">
        <Image
          src={CONSTANTS.LOGO}
          alt="Worksy - Smart Employee Management Platform"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="w-full max-w-md">
        {/* Logo Section with Enhanced Marketing Copy */}
        <div className="text-center w-full mb-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">
            Transform Your Workforce
          </h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Streamline operations, boost productivity, and empower your team
            with intelligent workforce solutions
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl !gap-0 hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-blue-700 bg-clip-text text-transparent mb-2">
              <span className="text-cyan-700"> Hey There,</span> Welcome Back
            </CardTitle>
            <p className="text-gray-500">
              Sign in to access your dashboard and unlock powerful insights
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your work email"
                    {...register("email")}
                    className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input with Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    {...register("password")}
                    className="h-12 pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                    Keep me signed in
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all duration-200"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Signing you in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Access Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Trust Indicators */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center text-xs text-gray-500 space-x-4">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-purple-500" />
                  <span>Enterprise Ready</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Footer */}
        <div className="mt-8 text-center space-y-3">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <span>SOC 2 Compliant</span>
            <span>•</span>
            <span>GDPR Ready</span>
            <span>•</span>
            <span>ISO 27001</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2024 Worksy. All rights reserved. Empowering businesses worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
