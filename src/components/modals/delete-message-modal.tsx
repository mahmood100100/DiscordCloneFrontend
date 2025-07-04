import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { softDeleteChannelMessage } from "@/redux/slices/server-slice";
import { softDeleteDirectMessageSuccess } from "@/redux/slices/conversation-slice";
import { deleteMessageApiCall } from "@/lib/message";
import { deleteDirectMessageApiCall } from "@/lib/direct-message";

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteMessage";
  const { messageId, query, messageType } = data;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteMessage = async (messageId: string) => {
    if (!messageId) {
      toast.error("Message ID is missing.");
      return;
    }

    try {
      setIsLoading(true);

      const response = messageType === "channel"
        ? await deleteMessageApiCall(messageId)
        : await deleteDirectMessageApiCall(messageId);

      if (response.success) {
        if (messageType === "channel") {
          dispatch(
            softDeleteChannelMessage({
              serverId: query?.serverId || "",
              channelId: query?.channelId || "",
              messageId,
            })
          );
        } else {
          dispatch(
            softDeleteDirectMessageSuccess({
              conversationId: query?.conversationId || "",
              directMessageId : messageId,
            })
          );
        }
        toast.success(response.message || "Message deleted successfully!");
        onClose();
      } else {
        toast.error(response.error || "Failed to delete message.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while deleting the message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Message</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete the message?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button onClick={onClose} disabled={isLoading} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteMessage(messageId || "")}
              disabled={isLoading}
              variant="primery"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;