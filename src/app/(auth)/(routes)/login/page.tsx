"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import LoginForm from "@/components/auth/forms/login-form";
import { RootState } from "@/redux/store";

const LoginPage = () => {
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  return <>{!accessToken &&
    <div className='w-full h-full flex justify-center items-center p-3' >
      <LoginForm />
    </div>
  }
  </>;
};

export default LoginPage;
