import { messageSignalRService } from "@/lib/signalr-service";
import { useDispatch } from "react-redux";
import { 
  addChannelMessage, 
  updateChannelMessage, 
  softDeleteChannelMessage, 
  hardDeleteChannelMessage 
} from "@/redux/slices/server-slice";

export const useMessageNotifications = () => {
  const dispatch = useDispatch();

  const setupListeners = () => {
    messageSignalRService.on("ReceiveMessageAdded", ({ serverId, channelId, message }) => {
      dispatch(addChannelMessage({ serverId, channelId, message }));
    });

    messageSignalRService.on("ReceiveMessageUpdated", ({ serverId, channelId, message }) => {
      dispatch(updateChannelMessage({ serverId, channelId, message: message }));
    });

    messageSignalRService.on("ReceiveMessageDeleted", ({ serverId, channelId, messageId }) => {
      dispatch(hardDeleteChannelMessage({ serverId, channelId, messageId }));
    });

    messageSignalRService.on("ReceiveMessageSoftDeleted", ({ serverId, channelId, messageId }) => {
      dispatch(softDeleteChannelMessage({ serverId, channelId, messageId }));
    });
  };

  const cleanup = () => {
    messageSignalRService.off("ReceiveMessageAdded");
    messageSignalRService.off("ReceiveMessageUpdated");
    messageSignalRService.off("ReceiveMessageDeleted");
    messageSignalRService.off("ReceiveMessageSoftDeleted");
  };

  return { setupListeners, cleanup };
};