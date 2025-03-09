import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { refreshTokenFailure, refreshTokenSuccess } from "@/redux/slices/auth-slice";
import api from "@/lib/api";

export const useTokenRefreshTimer = (expirationTimeInSeconds: number) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (expirationTimeInSeconds) {
      console.log("Starting token refresh timer...");

      let refreshTimeInSeconds = expirationTimeInSeconds - 300;

      if (refreshTimeInSeconds > 0) {
        console.log(`Token will be refreshed in ${refreshTimeInSeconds} seconds.`);

        const interval = setInterval(() => {
          console.log(`Timer running... Time left until refresh: ${refreshTimeInSeconds} seconds.`);
          refreshTimeInSeconds -= 1;
        }, 1000);

        const timer = setTimeout(async () => {
          try {
            console.log("Refreshing token...");
            const response = await api.post("/users/refresh-token");
            console.log("Token refreshed successfully", response.data);

            dispatch(refreshTokenSuccess({
              accessToken: response.data.accessToken,
              user: response.data.user,
              expiresIn: response.data.expiresIn 
            }));
          } catch (err) {
            console.error("Token refresh failed:", err);
            dispatch(refreshTokenFailure());
            router.push("/auth/login");
          }
        }, refreshTimeInSeconds * 1000);

        return () => {
          clearInterval(interval);
          clearTimeout(timer);
        };
      }
    }
  }, [expirationTimeInSeconds, dispatch, router]);
};
