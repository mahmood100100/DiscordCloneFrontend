"use client"
import { ChannelType } from '@/types/channel';
import { MemberRole } from '@/types/member';
import { Server } from '@/types/server';
import React from 'react'
import ActionTooltip from '../ui/action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { usePermissions } from '@/hooks/use-permissions';

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: Server;
}
const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const { onOpen } = useModal();
    const { canCreateChannel, canManageMembers } = usePermissions(server?.id);
    
    return (
        <div className='flex items-center justify-between py-2'>
            <p className='text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'>
                {label}
            </p>
            {canCreateChannel() && sectionType === "channels" && (
                <ActionTooltip label='Create Channel'>
                    <button onClick={() => { onOpen("createChannel" , {server , channelType}) }} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'>
                        <Plus className='h-4 w-4' />
                    </button>

                </ActionTooltip>
            )}

            {canManageMembers() && sectionType === "members" && (
                <ActionTooltip label='Manage Members'>
                    <button onClick={() => { onOpen("members" , {server}) }} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'>
                        <Settings className='h-4 w-4' />
                    </button>

                </ActionTooltip>
            )}

        </div>
    )
}

export default ServerSection