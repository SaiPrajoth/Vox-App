
"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { z } from "zod";

import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import verifyCodeSchema from "@/schemas/VerifyCodeSchema";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const params = useParams();
  const username = params.username;


  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
  });

  useEffect(() => {
    if (isResendDisabled) {
      setTimer(120); // 2 minutes countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isResendDisabled]);

  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {

    
    setIsSubmitting(true);
    try {
      console.log('this is the username',username);
      const response = await axios.post(`/api/verify-code?username=${username}`, data);
      toast({ title: "User Verification Successful", description: response.data.message });
      router.replace("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Sign Up Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    try {
      if (!username || Array.isArray(username)) {
        throw new Error('Invalid username');
      }
      console.log('this is the username',username);

      await axios.post(`/api/resend-verification-code?username=${encodeURIComponent(username)}`);
      toast({ title: "Verification code sent!", description: "Check your email." });
    } catch (error) {
      console.error('error occured while resending the code ', error);
      setIsResendDisabled(false); // Enable button again if API call fails
      toast({ title: "Failed to resend code", variant: "destructive" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Welcome to Prod App</h1>
          <p className="mb-4">Verify yourself</p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Input {...form.register("otp")} placeholder="Verification code" className="font-semibold text-black" />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="animate-spin" /> Please Wait</> : "Verify Code"}
            </Button>
          </form>
        </FormProvider>

        <div className="text-center mt-4">
          <p>Resend verification code?</p>
          <Button onClick={handleResendCode} disabled={isResendDisabled} className="mt-2">
            {isResendDisabled ? `Wait ${timer}s` : "Resend Code"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
