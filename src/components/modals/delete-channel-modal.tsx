import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { removeServerChannel } from "@/redux/slices/server-slice";
import { useParams, useRouter } from "next/navigation";
import { deleteChannelApiCall } from "@/lib/channel";
import { usePermissions } from "@/hooks/use-permissions";

const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  const profileId = useSelector((state: RootState) => state.auth.user?.profile?.id);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const router = useRouter();

  // استخدام hook الصلاحيات للتحقق من صلاحيات حذف القناة
  const { canDeleteSpecificChannel } = usePermissions(server?.id);

  // التحقق من صلاحيات حذف القناة باستخدام الدالة الجديدة
  const canDeleteThisChannel = useCallback(() => {
    if (!channel) return false;
    return canDeleteSpecificChannel(channel);
  }, [channel, canDeleteSpecificChannel]);

  // التحقق من الصلاحيات عند فتح المودال
  useEffect(() => {
    if (isModalOpen && !canDeleteThisChannel()) {
      toast.error("You don't have permission to delete this channel");
      onClose();
    }
  }, [isModalOpen, canDeleteThisChannel, onClose]);

  const handleDeleteChannel = async (requesterProfileId: string, channelId: string, serverId: string) => {
    // التحقق من الصلاحيات مرة أخرى قبل الحذف
    if (!canDeleteThisChannel()) {
      toast.error("You don't have permission to delete this channel");
      return;
    }

    try {
      setIsLoading(true);

      const response = await deleteChannelApiCall(requesterProfileId, channelId, serverId);

      if (response.success) {
        dispatch(removeServerChannel({ serverId: server?.id || "", channelId }));
        toast.success(response.message || "Channel deleted successfully!");

        const isViewingDeletedChannel = params?.channelId === channelId;
        if (isViewingDeletedChannel) {
          router.replace(`/servers/${serverId}`);
        } else {
          router.refresh();
        }

        onClose();
      } else {
        toast.error(response.error || "Failed to delete channel.");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong while deleting the channel.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // إذا لم يكن لديه صلاحية، لا نعرض المودال
  if (!canDeleteThisChannel()) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Delete Channel</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-indigo-500">{channel?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button onClick={onClose} disabled={isLoading} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteChannel(profileId || "", channel?.id || "", server?.id || "");
              }}
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

export default DeleteChannelModal;