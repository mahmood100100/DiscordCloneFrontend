"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateServerSuccess } from "@/redux/slices/server-slice";
import { getServerWithDetailsByIdApiCall } from "@/lib/server";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import { MemberRole } from "@/types/member";
import { useRouter } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServerSearch from "@/components/server/server-search";
import { ChannelType } from "@/types/channel";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSidebarProps {
  serverId: string;
  isMobile?: boolean;
}

const iconMap: { [key in ChannelType]: JSX.Element } = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerSidebar = ({ serverId , isMobile }: ServerSidebarProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const server = useSelector((state: RootState) => state.server.servers.find((s) => s.id === serverId));
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const [loading, setLoading] = useState(!server);

  useEffect(() => {
    const getDetailedServerById = async () => {
      if (!serverId) {
        router.replace("/");
        return;
      }

      setLoading(true);
      try {
        const response = await getServerWithDetailsByIdApiCall(serverId);
        if (response.success) {
          dispatch(updateServerSuccess(response.server));
        } else {
          toast.error(response.error);
          router.replace("/");
        }
      } catch (error) {
        toast.error("Failed to load server details.");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };

    if (!server?.channels) {
      getDetailedServerById();
    }

  }, [serverId, dispatch, router]);

  if (!profile) {
    router.replace("/login");
    return null;
  }

  if (loading) {
    return <div>Loading server details...</div>;
  }

  if (!server) {
    return null;
  }

  const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const members = server.members.filter((member) => (member.profileId !== profile.id)&& !member.deleted);
  const profileMember = server.members.find((member) => member.profileId === profile.id);
  const role = profileMember?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#25282B] bg-zinc-100">
      <ServerHeader isMobile = {isMobile} server={server} role={MemberRole[role ?? 2]} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profileName || "Unknown",
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
              server={server}
            />

          </div>
        )}

        <div className="space-y-[2px]">
          {textChannels?.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          ))}
        </div>
        {!!textChannels?.length && (<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />)}



        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
              server={server}
            />

          </div>
        )}
        <div className="space-y-[2px]">
          {audioChannels?.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />

          ))}

        </div>

        {!!audioChannels?.length && (<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />)}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
              server={server}
            />

          </div>
        )}

        <div className="space-y-[2px]">
          {videoChannels?.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          ))}
        </div>

        {!!videoChannels?.length && (<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />)}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />

          </div>
        )}

        <div>
          {members?.filter(member => !member.deleted).map(member => (
            <ServerMember key={member.id} server={server} member={member} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;