"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/splash-screen";

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { accessToken, isInitialized } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!accessToken && isInitialized) {
      router.push("/login");
    }
  }, [accessToken, isInitialized, router]);

  if (!isInitialized) {
    return <SplashScreen />;
  }

  if (!accessToken) {
    return null;
  }

  return <div className="w-full flex flex-col">
    <div className="">{children}</div>
  </div>;
};

export default SetupLayout;
