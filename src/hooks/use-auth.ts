"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/api"; 
import { refreshTokenSuccess, refreshTokenFailure, setIsInitialized } from "@/redux/slices/auth-slice";
import {useRouter } from "next/navigation";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { accessToken, loading, error, isInitialized , user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const handleRefreshToken = async () => {
      if (!accessToken && !isInitialized) {
        try {
          const response = await api.post("/users/refresh-token");

          dispatch(refreshTokenSuccess({
            accessToken: response.data.accessToken,
            user: response.data.user,
            expiresIn: response.data.expiresIn,
          }));

        } catch (err) {
          dispatch(refreshTokenFailure());
          router.replace('/login');
        } finally {
          dispatch(setIsInitialized(true));
        }
      }
    };

    if (!isInitialized) {
      handleRefreshToken();
    }
  }, [accessToken, isInitialized, dispatch]);

  return { accessToken, loading, error, isInitialized , user };
};
