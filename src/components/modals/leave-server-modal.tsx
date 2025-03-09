import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { removeServerMember } from "@/redux/slices/server-slice";
import { deleteMemberApiCall } from "@/lib/member";
import { useRouter } from "next/navigation";

const LeaveServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "leaveServer";
    const { server } = data;
    const serverId = server?.id;
    const reduxServer = useSelector((state : RootState) => state.server.servers.find((server) => server.id === serverId));
    const profileId = useSelector((state : RootState) => state.auth.user?.profile.id)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const onMemberDelete = async (requesterProfileId: string, serverId: string) => {
        try {
          setIsLoading(true);
          const targetMemberId = reduxServer?.members.find((member) => member.profileId === profileId)?.id;
          if(!targetMemberId) {
            toast.error("member not found");
            return;
          }
          const response = await deleteMemberApiCall(requesterProfileId, targetMemberId, serverId);
    
          if (response.success) {
            dispatch(removeServerMember({ serverId, memberId: targetMemberId , hard : false }));
            toast.success("you leaved the server.");
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
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                       Are you sure you want to leave <span className="font-semibold text-indigo-500">{reduxServer?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                      <Button onClick={onClose} disabled = {isLoading} variant={"ghost"}>
                        Cancel
                      </Button>
                      <Button onClick={() => {onMemberDelete(profileId || "" , reduxServer?.id || "")}} disabled = {isLoading} variant={"primery"}>
                        Confirm
                      </Button>
                    </div>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveServerModal;