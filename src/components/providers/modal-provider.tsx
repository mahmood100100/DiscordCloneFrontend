"use client"

import { useEffect, useState } from "react"
import CreateServerModal from "@/components/modals/create-server-modal"
import InviteModal from "@/components/modals/invite-modal";
import MembersModal from "@/components/modals/members-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import { useModal } from "@/hooks/use-modal-store";
import ChannelsModal from "@/components/modals/channels-modal";
import LeaveServerModal from "@/components/modals/leave-server-modal";
import DeleteServerModal from "@/components/modals/delete-server-modal";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import EditChannelModal from "@/components/modals/edit-channel-modal";
import DeleteChannelModal from "@/components/modals/delete-channel-modal";
import DeleteMessageModal from "@/components/modals/delete-message-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { type, isOpen } = useModal();


    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {type === "createServer" && isOpen && <CreateServerModal />}
            {type === "invite" && isOpen && <InviteModal />}
            {type === "editServer" && isOpen && <EditServerModal />}
            {type === "members" && isOpen && <MembersModal />}
            {type === "channels" && isOpen && <ChannelsModal />}
            {type === "leaveServer" && isOpen && <LeaveServerModal />}
            {type === "deleteServer" && isOpen && <DeleteServerModal />}
            {type === "createChannel" && isOpen && <CreateChannelModal />}
            {type === "editChannel" && isOpen && <EditChannelModal />}
            {type === "deleteChannel" && isOpen && <DeleteChannelModal />}
            {type === "deleteMessage" && isOpen && <DeleteMessageModal />}
        </>
    )
}