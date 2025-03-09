// src/signalr/member-notifications.ts
import { memberSignalRService } from "@/lib/signalr-service";
import { useDispatch, useSelector } from "react-redux";
import { updateServerMember, removeServerMember, addServerMember } from "@/redux/slices/server-slice";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useMemberNotifications = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUserProfileId = useSelector((state: RootState) => state.auth.user?.profile?.id);

  const setupListeners = () => {
    memberSignalRService.on("ReceiveRoleUpdated", ({ serverId, updatedMember }) => {
      dispatch(updateServerMember({ serverId, member: updatedMember }));
    });

    memberSignalRService.on("ReceiveMemberSoftDeleted", ({ serverId, softDeletedMember, profileId, isKicked }) => {
      
      const isCurrentUser = softDeletedMember?.profileId === currentUserProfileId;
      
      dispatch(removeServerMember({ serverId, memberId: softDeletedMember.id, hard: false }));
    
      if (isCurrentUser) {
        if (isKicked) {
          toast.error("You have been kicked from the server.");
          router.replace("/");
        } else {
          toast.error("You have left the server.");
          router.replace("/");
        }
      }
    });
    memberSignalRService.on("ReceiveMemberAdded", ({ serverId, addedMember }) => {

      const isCurrentUser = addedMember.profileId === currentUserProfileId;

      if (!isCurrentUser) {
        dispatch(addServerMember({ serverId, member: addedMember }));
      }
      if (isCurrentUser) {
        toast.success("You have been added to the server!");
      }
    });
  };

  const cleanup = () => {
    memberSignalRService.off("ReceiveRoleUpdated");
    memberSignalRService.off("ReceiveMemberSoftDeleted");
    memberSignalRService.off("ReceiveMemberAdded");
  };

  return { setupListeners, cleanup };
};