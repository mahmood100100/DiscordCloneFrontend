"use client";

import ServerSidebar from "@/components/server/server-sidebar";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

const ServerIdLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) => {
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const servers = useSelector((state: RootState) => state.server.servers) || [];
  const [serverId, setServerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const { serverId: resolvedServerId } = await params;
        setServerId(resolvedServerId);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading server...
          </p>
        </div>
      </div>
    );
  }

  if (!profile || !serverId) {
    return (
      <div className="h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  const targetServer = servers.find((server) => server.id === serverId);
  if (!targetServer) {
    return (
      <div className="h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Server not found, redirecting...
          </p>
        </div>
      </div>
    );
  }

  const userMember = targetServer.members.find((m) => m.profileId === profile.id);
  if (!userMember || userMember.deleted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Access denied, redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="hidden lg:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full lg:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;