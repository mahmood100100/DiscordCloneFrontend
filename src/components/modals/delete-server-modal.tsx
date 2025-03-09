import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { deleteServerSuccess } from "@/redux/slices/server-slice";
import { useRouter } from "next/navigation";
import { deleteServerApiCall } from "@/lib/server";

const DeleteServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteServer";
    const { server } = data;
    const profileId = useSelector((state : RootState) => state.auth.user?.profile.id)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const onServerDelete = async (requesterProfileId: string, serverId: string) => {
        try {
          setIsLoading(true);

          const response = await deleteServerApiCall(requesterProfileId, serverId);
    
          if (response.success) {
            dispatch(deleteServerSuccess(serverId));
            toast.success("Server deleted successfully");
            onClose();
            router.replace('/')
          } else {
            toast.error(response.error || "Failed to leaved the server.");
          }
        } catch (error) {
          toast.error("Something went wrong while leaving the server.");
        } finally {
            setIsLoading(false);
        }
      };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                       Are you sure you want to Delete <span className="font-semibold text-indigo-500">{server?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                      <Button onClick={onClose} disabled = {isLoading} variant={"ghost"}>
                        Cancel
                      </Button>
                      <Button onClick={() => {onServerDelete(profileId || "" , server?.id || "")}} disabled = {isLoading} variant={"primery"}>
                        Confirm
                      </Button>
                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteServerModal;