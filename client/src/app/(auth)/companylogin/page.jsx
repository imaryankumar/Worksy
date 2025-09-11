"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/lib/constants";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield,
  CheckCircle,
  Clock,
  Users,
  Briefcase,
  UserCheck,
} from "lucide-react";

// Step 1: Company Details Schema
const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyEmail: z.string().email("Enter a valid company email"),
  companyPhone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Phone number too long"),
  gstNumber: z
    .string()
    .min(15, "GST number must be 15 characters")
    .max(15, "GST number must be 15 characters"),
  address: z.string().min(10, "Please enter complete address"),
});

// Step 2: User Details Schema
const userSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  ownerEmail: z.string().email("Enter a valid email"),
  ownerPhone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Phone number too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and number"
    ),
  role: z.string().default("Admin"),
  gender: z.enum(["male", "female", "other"], "Please select gender"),
});

// Combined schema for final submission
const registrationSchema = companySchema.merge(userSchema);

const CompanyRegister = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [companyData, setCompanyData] = useState({});

  // Step 1 Form - Company Details
  const {
    register: registerCompany,
    handleSubmit: handleCompanySubmit,
    formState: { errors: companyErrors },
    trigger: triggerCompany,
  } = useForm({
    resolver: zodResolver(companySchema),
    mode: "onChange",
  });

  // Step 2 Form - User Details
  const {
    register: registerUser,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors, isSubmitting },
    setValue: setUserValue,
    watch: watchUser,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "Admin",
      gender: "male",
    },
    mode: "onChange",
  });

  const selectedGender = watchUser("gender");

  // Handle Step 1 submission
  const onCompanySubmit = async (data) => {
    const isValid = await triggerCompany();
    if (isValid) {
      setCompanyData(data);
      setCurrentStep(2);
      toast.success("Company details saved! Now complete your profile.");
    }
  };

  // Handle Step 2 submission
  const onUserSubmit = async (userData) => {
    try {
      const finalData = { ...companyData, ...userData };

      // Dispatch registration action
      await dispatch(registerCompany(finalData)).unwrap();

      toast.success("Registration successful! Welcome to Worksy!");
      router.push("/overview"); // Redirect to dashboard after successful registration
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo & Header Section */}
        <div className="text-center w-full mb-8">
          <div className="relative w-52 h-20 mx-auto">
            <Image
              src={CONSTANTS.LOGO}
              alt="Worksy - Smart Employee Management Platform"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
            Join Worksy Today
          </h1>
          <p className="text-gray-600 text-base mt-2 leading-relaxed max-w-lg mx-auto">
            Create your company account and start managing your workforce with
            powerful HR tools designed for modern businesses
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <span className="ml-2 font-medium">Company Details</span>
            </div>
            <div
              className={`w-12 h-0.5 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`flex items-center ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="ml-2 font-medium">Admin Profile</span>
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              {currentStep === 1 ? (
                <>
                  <Building2 className="w-6 h-6 inline-block mr-2 text-blue-600" />
                  Company Information
                </>
              ) : (
                <>
                  <User className="w-6 h-6 inline-block mr-2 text-blue-600" />
                  Administrator Details
                </>
              )}
            </CardTitle>
            <p className="text-gray-500">
              {currentStep === 1
                ? "Tell us about your company to get started with Worksy"
                : "Create your admin account to manage your workforce"}
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Step 1: Company Details */}
            {currentStep === 1 && (
              <form
                onSubmit={handleCompanySubmit(onCompanySubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Company Name
                    </label>
                    <Input
                      placeholder="Enter your company name"
                      {...registerCompany("companyName")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
                    {companyErrors.companyName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {companyErrors.companyName.message}
                      </p>
                    )}
                  </div>

                  {/* Company Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Company Email
                    </label>
                    <Input
                      type="email"
                      placeholder="info@company.com"
                      {...registerCompany("companyEmail")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
                    {companyErrors.companyEmail && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {companyErrors.companyEmail.message}
                      </p>
                    )}
                  </div>

                  {/* Company Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Company Phone
                    </label>
                    <Input
                      placeholder="+91 9876543210"
                      {...registerCompany("companyPhone")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
                    {companyErrors.companyPhone && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {companyErrors.companyPhone.message}
                      </p>
                    )}
                  </div>

                  {/* GST Number */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      GST Number
                    </label>
                    <Input
                      placeholder="GSTIN123456789"
                      {...registerCompany("gstNumber")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                      maxLength={15}
                    />
                    {companyErrors.gstNumber && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {companyErrors.gstNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Address */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Company Address
                  </label>
                  <Input
                    placeholder="Enter complete company address"
                    {...registerCompany("address")}
                    className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                  />
                  {companyErrors.address && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {companyErrors.address.message}
                    </p>
                  )}
                </div>

                {/* Next Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Continue to Admin Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Button>
              </form>
            )}

            {/* Step 2: User Details */}
            {currentStep === 2 && (
              <form
                onSubmit={handleUserSubmit(onUserSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Owner Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Full Name
                    </label>
                    <Input
                      placeholder="Enter your full name"
                      {...registerUser("ownerName")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
                    {userErrors.ownerName && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {userErrors.ownerName.message}
                      </p>
                    )}
                  </div>

                  {/* Owner Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@company.com"
                      {...registerUser("ownerEmail")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
                    {userErrors.ownerEmail && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {userErrors.ownerEmail.message}
                      </p>
                    )}
                  </div>

                  {/* Owner Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      Phone Number
                    </label>
                    <Input
                      placeholder="+91 9876543210"
                      {...registerUser("ownerPhone")}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
                    {userErrors.ownerPhone && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {userErrors.ownerPhone.message}
                      </p>
                    )}
                  </div>

                  {/* Role (Hidden/Default) */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      Role
                    </label>
                    <Input
                      value="Admin"
                      disabled
                      className="h-12 border-gray-300 bg-gray-50 text-gray-600 rounded-xl"
                    />
                    <p className="text-xs text-gray-500">
                      You'll be set as the company administrator
                    </p>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...registerUser("password")}
                      className="h-12 pr-10 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
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
                  {userErrors.password && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {userErrors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Must contain uppercase, lowercase letters and numbers
                  </p>
                </div>

                {/* Gender Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Gender
                  </label>
                  <RadioGroup
                    value={selectedGender}
                    onValueChange={(value) => setUserValue("gender", value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                  {userErrors.gender && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {userErrors.gender.message}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    onClick={goToPreviousStep}
                    variant="outline"
                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Company</span>
                    </div>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Create Account</span>
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-gray-100 mt-8">
              <div className="flex items-center justify-center text-xs text-gray-500 space-x-6">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Bank-Level Security</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-purple-500" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all duration-200"
            >
              Sign in here
            </button>
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
            <span>SOC 2 Type II</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2024 Worksy Technologies. All rights reserved. Trusted by 10,000+
            companies worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
