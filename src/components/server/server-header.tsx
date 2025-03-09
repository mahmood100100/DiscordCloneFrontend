"use client";

import { MemberRole } from "@/types/member";
import { Server } from "@/types/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Edit, LogOut, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

interface ServerHeaderProps {
    server: Server;
    role?: string;
    isMobile?: boolean;
}

const ServerHeader = ({ server, role , isMobile }: ServerHeaderProps) => {
    const { onOpen } = useModal()
    const isAdmin = role === MemberRole[0];
    const isModerator = role === MemberRole[1];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="
          w-full h-12 px-3 flex items-center text-base font-semibold
          border-b-2 border-neutral-200 hover:bg-zinc-700/10 dark:border-neutral-800
          dark:hover:bg-zinc-700/50 transition
        ">
                    {server.name}
                    <ChevronDown className= {cn("h-5 w-5 ml-auto" , isMobile && "ml-1")} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {(isModerator || isAdmin) && (
                    <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                        onClick={() => { onOpen("invite", { server }) }}>
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto" />

                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem onClick={() => { onOpen("editServer", { server }) }} className="px-3 py-2 text-sm cursor-pointer">
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto" />

                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem onClick={() => { onOpen("members", { server }) }} className="px-3 py-2 text-sm cursor-pointer">
                        Manage Members
                        <Users className="h-4 w-4 ml-auto" />

                    </DropdownMenuItem>
                )}

                {(isModerator || isAdmin) && (
                    <DropdownMenuItem onClick={() => { onOpen("channels", { server }) }} className="px-3 py-2 text-sm cursor-pointer">
                        Manage Channels
                        <Edit className="h-4 w-4 ml-auto" />

                    </DropdownMenuItem>
                )}

                {(isModerator || isAdmin) && (
                    <DropdownMenuSeparator />
                )}

                {isAdmin && (
                    <DropdownMenuItem onClick={() => { onOpen("deleteServer", { server }) }} className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto" />

                    </DropdownMenuItem>
                )}

                {!isAdmin && (
                    <DropdownMenuItem onClick={() => { onOpen("leaveServer", { server }) }} className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />

                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ServerHeader;
