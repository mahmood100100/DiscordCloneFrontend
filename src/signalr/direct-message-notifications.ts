import { dmSignalRService } from "@/lib/signalr-service";
import { useDispatch } from "react-redux";
import { addDirectMessageSuccess, updateDirectMessageSuccess, hardDeleteDirectMessageSuccess, softDeleteDirectMessageSuccess } from "@/redux/slices/conversation-slice";

export const useDMNotifications = () => {
  const dispatch = useDispatch();

  const setupListeners = () => {
    dmSignalRService.on("ReceiveDirectMessageAdded", ({ conversationId, message }) => {
      dispatch(addDirectMessageSuccess({ conversationId, directMessage: message }));
    });

    dmSignalRService.on("ReceiveDirectMessageUpdated", ({ conversationId, updatedMessage }) => {
      dispatch(updateDirectMessageSuccess({ conversationId, directMessage: updatedMessage }));
    });

    dmSignalRService.on("ReceiveDirectMessageDeleted", ({ conversationId, messageId }) => {
      dispatch(hardDeleteDirectMessageSuccess({ conversationId, directMessageId: messageId }));
    });

    dmSignalRService.on("ReceiveDirectMessageSoftDeleted", ({ conversationId, messageId }) => {
      dispatch(softDeleteDirectMessageSuccess({ conversationId, directMessageId: messageId }));
    });
  };

  const cleanup = () => {
    dmSignalRService.off("ReceiveDirectMessageAdded");
    dmSignalRService.off("ReceiveDirectMessageUpdated");
    dmSignalRService.off("ReceiveDirectMessageDeleted");
    dmSignalRService.off("ReceiveDirectMessageSoftDeleted");
  };

  return { setupListeners, cleanup };
};