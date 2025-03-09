"use client";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getChannelById } from "@/lib/channel";
import { updateServerChannel, setActiveChannel } from "@/redux/slices/server-slice";
import { RootState } from "@/redux/store";
import { ChannelType } from "@/types/channel";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import { Loader2 } from "lucide-react";

interface ChannelIdPageProps {
  params: Promise<{ serverId: string; channelId: string }>;
}

const ChannelIdPage = ({ params }: ChannelIdPageProps) => {
  const resolvedParams = use(params);
  const serverId = resolvedParams.serverId;
  const channelId = resolvedParams.channelId;

  const router = useRouter();
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const member = useSelector((state: RootState) =>
    state.server.servers
      .find((server) => server.id === serverId)
      ?.members.find((member) => member.profileId === profile?.id)
  );
  const channel = useSelector((state: RootState) =>
    state.server.servers
      .find((server) => server.id === serverId)
      ?.channels.find((channel) => channel.id === channelId)
  );
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannel = async (channelId: string) => {
      setLoading(true);
      try {
        const response = await getChannelById(channelId);
        if (response.success) {
          dispatch(updateServerChannel({ serverId: serverId, channel: response.result }));
          dispatch(setActiveChannel(response.result.id));
        } else {
          toast.error(response.error || "Failed to get channel");
          router.push("/");
        }
      } catch (err) {
        toast.error("Something went wrong while fetching the channel.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (channelId) {
      fetchChannel(channelId);
    } else {
      toast.error("Invalid channel ID");
      setLoading(false);
      router.push("/");
    }
  }, [channelId, serverId, dispatch, router]);

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Please log in to view this channel...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading channel...
          </p>
        </div>
      </div>
    );
  }

  if (!channel || !member) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Preparing channel content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            chatId={channel.id}
            member={member}
            type="channel"
            query={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            query={{ channelId: channel.id, serverId: channel.serverId, memberId: member.id }}
            name={channel.name}
            type="channel"
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} audio={true} video={false} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} audio={false} video={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;