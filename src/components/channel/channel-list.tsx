// ChannelsList.tsx
import React from "react";
import { Channel } from "@/types/channel";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Trash, Pencil } from "lucide-react";
import { MemberRole } from "@/types/member";

const ChannelsList = ({
  loadingId,
  setLoadingId,
  profile,
  serverId,
  reduxServer,
  handleDeleteChannel,
  setRenameModalOpen,
  setChannelToRename
}: {
  loadingId: string;
  setLoadingId: React.Dispatch<React.SetStateAction<string>>;
  profile: any;
  serverId: string;
  reduxServer: any;
  handleDeleteChannel: (requesterProfileId: string, channelId: string, serverId: string) => void;
  setRenameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelToRename: React.Dispatch<React.SetStateAction<Channel | null>>;
}) => {
  return (
    <div className="px-2 mt-4 max-h-[170px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-white rounded-md border border-zinc-200">
      {reduxServer?.channels.map((channel: Channel) => {
        const isCreator = channel.profileId === profile?.id;
        const isGeneralChannel = channel.name.toLowerCase() === "general";

        return (
          <div key={channel.id} className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-100 transition-colors">
            <div className="flex flex-col gap-y-1">
              <div className="text-sm font-semibold flex items-center">
                {channel.name}
                <span className="ml-2 text-xs text-zinc-500">
                  ({channel.type === 0 ? "Text" : channel.type === 1 ? "Voice" : "Video"})
                </span>
              </div>
            </div>

            {!isGeneralChannel &&
              (isCreator || MemberRole[profile?.role ?? 2] === "ADMIN") &&
              loadingId !== channel.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4 text-zinc-500 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left" className="w-48">
                    <DropdownMenuItem
                      onClick={() => {
                        setChannelToRename(channel);
                        setRenameModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-600 focus:text-blue-600"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename Channel
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDeleteChannel(profile?.id, channel.id, serverId)}
                      className="text-red-500 hover:text-red-600 focus:text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Channel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            {loadingId === channel.id && (
              <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChannelsList;
