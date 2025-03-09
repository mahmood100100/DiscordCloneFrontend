"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import SplashScreen from "@/components/splash-screen";
import SetupLayout from "@/app/(setup)/layout";
import SetupPage from "./(setup)/page";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Home: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, loading, isInitialized } = useAuth();
  const servers = useSelector((state: RootState) => state.server.servers) || [];
  const profile = useSelector((state: RootState) => state.auth.user?.profile);

  useEffect(() => {
    if (!isInitialized) return;

    if (!accessToken) {
      console.log("Not authenticated, redirecting to /login...");
      router.replace("/login");
      return;
    }

    if (profile && servers.length > 0) {
      console.log("Authenticated, redirecting to first valid server...");
      const firstValidServer = servers.find(server => {
        const userMember = server.members.find(m => m.profileId === profile.id);
        return userMember && !userMember.deleted;
      });

      const redirectPath = firstValidServer ? `/servers/${firstValidServer.id}` : "/setup";

      if (pathname !== redirectPath) {
        router.replace(redirectPath);
      }
    }
  }, [accessToken, isInitialized, profile, servers, router, pathname]);

  if (loading || !isInitialized) {
    return <SplashScreen />;
  }

  if (accessToken && (!profile || servers.length === 0)) {
    return (
      <SetupLayout>
        <SetupPage />
      </SetupLayout>
    );
  }

  return null;
};

export default Home;
