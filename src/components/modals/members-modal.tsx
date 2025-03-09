import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

import { useModal } from "@/hooks/use-modal-store";
import { updateServerMember, removeServerMember } from "@/redux/slices/server-slice";
import { Member, MemberRole } from "@/types/member";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
    DropdownMenuContent,
    DropdownMenuSub
} from "@/components/ui/dropdown-menu";

import UserAvatar from "@/components/user-avatar";
import { deleteMemberApiCall, updateMemberDataApiCall } from "@/lib/member";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const MembersModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "members";
    const [loadingId, setLoadingId] = useState("");
    const dispatch = useDispatch();
    const { server } = data;
    const serverId = server?.id;
    const router = useRouter();
    const profile = useSelector((state: RootState) => state.auth.user?.profile!);
    const currentMember = server?.members.find((member: Member) => member.profileId === profile.id);
    const reduxServer = useSelector((state: RootState) => state.server.servers.find(server => server.id === serverId));
    const adminCount = reduxServer?.members.filter((member: Member) => member.role === MemberRole.ADMIN).length || 0;

    const activeConversationId = useSelector((state: RootState) => state.conversation.activeConversationId);
    const conversations = useSelector((state: RootState) => state.conversation.conversations);
    const activeConversation = conversations.find(conv => conv.id === activeConversationId);


    const roleIconsMap = {
        "GUEST": null,
        "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
        "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
    };

    const onRoleChange = async (requesterProfileId: string, targetMemberId: string, role: number, serverId: string) => {
        try {
            setLoadingId(targetMemberId);
            const response = await updateMemberDataApiCall(requesterProfileId, targetMemberId, role, serverId);

            if (response.success) {
                const member: Member = response.result;
                dispatch(updateServerMember({ serverId, member }));
                toast.success(response.message || "Role updated successfully.");
            } else {
                toast.error(response.error || "Failed to update role.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while updating the role.");
        } finally {
            setLoadingId("");
        }
    };

    const onMemberDelete = async (requesterProfileId: string, targetMemberId: string, serverId: string) => {
        try {
            setLoadingId(targetMemberId);
            const response = await deleteMemberApiCall(requesterProfileId, targetMemberId, serverId);

            if (response.success) {
                dispatch(removeServerMember({ serverId, memberId: targetMemberId, hard: false }));
                toast.success(response.message || "Member deleted successfully.");

                if (activeConversation && ( (activeConversation.memberOneId === targetMemberId) || (activeConversation.memberTwoId === targetMemberId) )) {
                    const generalChannel = reduxServer?.channels.find(channel => channel.name.toLowerCase() === "general");
                    router.replace(generalChannel ? `/servers/${serverId}/channels/${generalChannel.id}` : `/servers/${serverId}`);
                }
            } else {
                toast.error(response.error || "Failed to delete member.");
            }
        } catch (error) {
            toast.error("Something went wrong while deleting the member.");
        } finally {
            setLoadingId("");
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 pr-6 max-h-[420px]">
                    {reduxServer?.members
                        .filter(member => !member.deleted)
                        .map(member => {
                            const isSelf = currentMember?.id === member.id;
                            const isAdmin = member.role === MemberRole.ADMIN;
                            const isOnlyAdmin = isAdmin && adminCount === 1;

                            return (
                                <div key={member.id} className="flex items-center gap-x-2 mb-6">
                                    <UserAvatar src={member.profileImageUrl} />
                                    <div className="flex flex-col gap-y-1">
                                        <div className="text-xs font-semibold flex items-center">
                                            {member.profileName}
                                            {roleIconsMap[MemberRole[member.role] as keyof typeof roleIconsMap]}
                                        </div>
                                        <p className="text-xs text-zinc-500">{member.profileEmail}</p>
                                    </div>

                                    {!isSelf && loadingId !== member.id && (
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-4 w-4 text-zinc-500" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="left">
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger className="flex items-center">
                                                            <ShieldQuestion className="w-4 h-4" />
                                                            <span>Role</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuPortal>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem
                                                                    onClick={() => onRoleChange(profile.id, member.id, MemberRole.GUEST, reduxServer.id)}
                                                                    disabled={MemberRole[member.role] === "GUEST" || (currentMember?.role === MemberRole.ADMIN && member.role === MemberRole.ADMIN)}
                                                                >
                                                                    <Shield className="h-4 w-4" />
                                                                    Guest
                                                                    {MemberRole[member.role] === "GUEST" && <Check className="w-4 h-4 ml-auto" />}
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() => onRoleChange(profile.id, member.id, MemberRole.MODERATOR, reduxServer.id)}
                                                                    disabled={MemberRole[member.role] === "MODERATOR" || (currentMember?.role === MemberRole.ADMIN && member.role === MemberRole.ADMIN)}
                                                                >
                                                                    <ShieldCheck className="h-4 w-4" />
                                                                    Moderator
                                                                    {MemberRole[member.role] === "MODERATOR" && <Check className="w-4 h-4 ml-auto" />}
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() => onRoleChange(profile.id, member.id, MemberRole.ADMIN, reduxServer.id)}
                                                                    disabled={MemberRole[member.role] === "ADMIN" || (currentMember?.role === MemberRole.ADMIN && member.role === MemberRole.ADMIN)}
                                                                >
                                                                    <ShieldAlert className="h-4 w-4" />
                                                                    Admin
                                                                    {MemberRole[member.role] === "ADMIN" && <Check className="w-4 h-4 ml-auto" />}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuPortal>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => onMemberDelete(profile.id, member.id, reduxServer.id)}
                                                        disabled={
                                                            (currentMember?.role === MemberRole.ADMIN && member.role === MemberRole.ADMIN) ||
                                                            (currentMember?.role === MemberRole.MODERATOR && member.role === MemberRole.ADMIN)
                                                        }
                                                    >
                                                        <Gavel className="h-4 w-4" />
                                                        Kick
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}

                                    {isSelf && (
                                        <div className="ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-4 w-4 text-zinc-500" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="left">
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger className="flex items-center">
                                                            <ShieldQuestion className="w-4 h-4" />
                                                            <span>Change My Role</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuPortal>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem
                                                                    onClick={() => onRoleChange(profile.id, member.id, MemberRole.GUEST, reduxServer.id)}
                                                                    disabled={isOnlyAdmin}
                                                                >
                                                                    <Shield className="h-4 w-4" />
                                                                    Guest
                                                                    {currentMember?.role === MemberRole.GUEST && <Check className="w-4 h-4 ml-auto" />}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => onRoleChange(profile.id, member.id, MemberRole.MODERATOR, reduxServer.id)}
                                                                    disabled={isOnlyAdmin}
                                                                >
                                                                    <ShieldCheck className="h-4 w-4" />
                                                                    Moderator
                                                                    {currentMember?.role === MemberRole.MODERATOR && <Check className="w-4 h-4 ml-auto" />}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuPortal>
                                                    </DropdownMenuSub>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}

                                    {loadingId === member.id && (
                                        <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                                    )}
                                </div>
                            );
                        })}
                </ScrollArea>

            </DialogContent>
        </Dialog>
    );
};

export default MembersModal;
