"use client";

import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ServerIdPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerIdPage = ({ params }: ServerIdPageProps) => {
  const router = useRouter();
  const [serverId, setServerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setServerId(resolvedParams.serverId);
      setLoading(false);
    };

    resolveParams();
  }, [params]);

  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const server = useSelector((state: RootState) =>
    state.server.servers.find((server) => server.id === serverId)
  );
  const initialChannel = server?.channels.find(
    (channel) => channel.name.toLowerCase() === "general"
  );

  useEffect(() => {
    if (loading || !profile || !serverId) return;

    if (!server) {
      return;
    }

    const userMember = server.members.find((m) => m.profileId === profile.id);
    if (!userMember || userMember.deleted) {
      return;
    }

    if (initialChannel) {
      const targetPath = `/servers/${server.id}/channels/${initialChannel.id}`;
      if (window.location.pathname === `/servers/${serverId}`) {
        router.push(targetPath);
      }
    }
  }, [loading, profile, server, initialChannel, serverId, router]);

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

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Preparing server content...
        </p>
      </div>
    </div>
  );
};

export default ServerIdPage;