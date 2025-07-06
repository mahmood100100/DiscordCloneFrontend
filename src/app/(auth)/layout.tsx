"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/splash-screen";
import { useAuth } from "@/hooks/use-auth";
import { RootState } from "@/redux/store";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { accessToken, isInitialized } = useSelector((state: RootState) => state.auth);

  useAuth();

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }

  }, [accessToken, router]);

  if (!isInitialized) {
    return <SplashScreen />;
  }

  if (accessToken) {
    return null;
  }

  return (
    <div className="h-screen flex justify-center">
      <div className="overflow-y-auto max-h-screen w-full">
        {children}
      </div>
    </div>
  )
};

export default AuthLayout;
