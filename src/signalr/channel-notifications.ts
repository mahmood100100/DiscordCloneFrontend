import { channelSignalRService } from "@/lib/signalr-service";
import { useDispatch} from "react-redux";
import { addServerChannel, removeServerChannel, updateServerChannel } from "@/redux/slices/server-slice";
import {store} from "@/redux/store";
import { useRouter } from "next/navigation";

export const useChannelNotifications = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const setupListeners = () => {
    channelSignalRService.on("ReceiveChannelAdded", ({ serverId, addedChannel }) => {
      dispatch(addServerChannel({ serverId, channel: addedChannel }));
    });

    channelSignalRService.on("ReceiveChannelDeleted", ({ serverId, deletedChannelId }) => {

      dispatch(removeServerChannel({ serverId, channelId: deletedChannelId }));

      const latestActiveChannelId = store.getState().server.activeChannelId;

      if (latestActiveChannelId === deletedChannelId) {
        const server = store.getState().server.servers.find(s => s.id === serverId);
        const generalChannelId = server?.channels.find(c => c.name.toLowerCase() === "general")?.id;
        
        if (generalChannelId) {
          router.replace(`/servers/${serverId}/channels/${generalChannelId}`);
        } else {
          router.replace(`/servers/${serverId}`);
        }
      }
    });

    channelSignalRService.on("ReceiveChannelUpdated", ({ serverId, updatedChannel }) => {
      dispatch(updateServerChannel({ serverId, channel: updatedChannel }));
    });
  };

  const cleanup = () => {
    channelSignalRService.off("ReceiveChannelAdded");
    channelSignalRService.off("ReceiveChannelDeleted");
    channelSignalRService.off("ReceiveChannelUpdated");
  };

  return { setupListeners, cleanup };
};