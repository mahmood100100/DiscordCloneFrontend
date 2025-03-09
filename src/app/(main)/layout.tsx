"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSelector, useDispatch } from "react-redux";
import SplashScreen from "@/components/splash-screen";
import { getServersForUserProfileApiCall } from "@/lib/server";
import { setServers } from "@/redux/slices/server-slice";
import NavigationSidebar from "@/components/navigations/navigation-sidebar";
import { RootState } from "@/redux/store";
import { Server } from "@/types/server";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { accessToken, loading, isInitialized } = useAuth();
  const servers = useSelector((state: RootState) => state.server.servers) || [];
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const [loadingServers, setLoadingServers] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {

    if (!isInitialized || loading) {
      return;
    }

    if (!accessToken || !profile?.id) {
      if (pathname !== "/") router.replace("/");
      return;
    }

    const fetchServers = async () => {
      if (servers.length > 0 && hasFetched) {
        checkServerAccess();
        setLoadingServers(false);
        return;
      }

      try {
        const response = await getServersForUserProfileApiCall(profile.id);
        if (response.success && response.servers.length > 0) {
          dispatch(setServers(response.servers));
          setHasFetched(true);
          checkServerAccess(response.servers);
        } else {
          if (pathname !== "/") router.replace("/");
        }
      } catch (error) {
        if (pathname !== "/") router.replace("/");
      } finally {
        setLoadingServers(false);
      }
    };

    const checkServerAccess = (fetchedServers = servers) => {
      const isServerPath = pathname?.startsWith("/servers/");
      const serverIdFromURL = pathname?.split("/")[2];

      if (pathname?.startsWith("/settings") || pathname === "/") {
        return;
      }

      if (!isServerPath) {
        redirectToFirstValidServer(fetchedServers);
        return;
      }

      if (!serverIdFromURL) {
        redirectToFirstValidServer(fetchedServers);
        return;
      }

      const targetServer = fetchedServers.find(server => server.id === serverIdFromURL);
      if (!targetServer) {
        redirectToFirstValidServer(fetchedServers);
        return;
      }

      const userMember = targetServer.members.find(m => m.profileId === profile.id);
      if (!userMember || userMember.deleted) {
        redirectToFirstValidServer(fetchedServers);
      }
    };

    const redirectToFirstValidServer = (fetchedServers: Server[]) => {
      const firstValidServer = fetchedServers.find(server => {
        const userMember = server.members.find(m => m.profileId === profile.id);
        return userMember && !userMember.deleted;
      });
      const redirectPath = firstValidServer ? `/servers/${firstValidServer.id}` : "/";
      if (redirectPath !== pathname) {
        router.replace(redirectPath);
      }
    };

    fetchServers();
  }, [accessToken, isInitialized, profile, servers, pathname, router, dispatch, loading, hasFetched]);

  if (!isInitialized || loading || loadingServers) {
    return <SplashScreen />;
  }

  if (!profile?.id || !accessToken) {
    return null;
  }

  if (servers.length === 0) {
    return <div>No servers available</div>;
  }

  return (
    <div className="h-full dark:bg-[#2B2D31]">
      <div className="hidden lg:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="lg:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;