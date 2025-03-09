"use client";

import { getServerByInviteCodeApiCall } from "@/lib/server";
import { addMemberToServerApiCall } from "@/lib/member";
import { RootState } from "@/redux/store";
import { Server } from "@/types/server";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addServerMember } from "@/redux/slices/server-slice";
import { Loader2 } from "lucide-react";

interface InviteCodePageProps {
  params?: Promise<{
    inviteCode?: string;
  }>;
}

const InviteCodePage = ({ params }: InviteCodePageProps) => {
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const dispatch = useDispatch();
  const router = useRouter();

  const [existingServer, setExistingServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      if (params) {
        const resolvedParams = await params;
        setInviteCode(resolvedParams?.inviteCode || null);
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!inviteCode) {
      router.replace("/");
      return;
    }
  }, [inviteCode, router]);

  useEffect(() => {
    if (inviteCode && profile?.id) {
      getServerIfExistForProfile(inviteCode);
    }
  }, [inviteCode, profile]);

  const getServerIfExistForProfile = async (inviteCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getServerByInviteCodeApiCall(inviteCode);
      console.log(response);

      if (response.success) {
        const server = response.result;
        setExistingServer(server);

        if (server.members.some((member) => member.profileId === profile?.id)) {
          router.replace(`/servers/${server.id}`);
        } else {
          addMemberToServer(server.id, profile?.id || "");
        }
      } else {
        setError("Server not found.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching server data.");
    } finally {
      setLoading(false);
    }
  };

  const addMemberToServer = async (serverId: string, profileId: string) => {
    try {
      const response = await addMemberToServerApiCall(serverId, profileId);
      console.log(response);

      if (response.success) {
        const member = response.result;
        dispatch(addServerMember({ serverId, member }));
        console.log(member);
        router.replace(`/servers/${serverId}`);
      } else if (response.statusCode === 409) {
        router.replace(`/servers/${serverId}`);
      } else {
        setError("Failed to add a member");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while adding the member.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Joining the server...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        {error && (
          <p className="text-red-500 font-medium mb-4">{error}</p>
        )}
        {!loading && !existingServer && (
          <p className="text-gray-700 dark:text-gray-300">
            No server found with the given invite code.
          </p>
        )}
      </div>
    </div>
  );
};

export default InviteCodePage;
