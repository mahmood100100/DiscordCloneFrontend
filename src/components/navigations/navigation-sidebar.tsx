import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import NavigationAction from './navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Server } from '@/types/server';
import NavigationItem from './navigation-item';
import { ModeToggle } from '../providers/mode-toggle';
import UserMenu from '../auth/layouts/user-menu';
import ActionTooltip from '../ui/action-tooltip';
import { RootState } from '@/redux/store';

const NavigationSidebar = () => {
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const servers = useSelector((state: RootState) => state.server.servers);
  const router = useRouter();

  if (!profile) {
    router.replace('/');
    return null;
  }

  const activeServers = servers.filter((server: Server) => {
    const currentUserMember = server.members.find(
      (member) => member.profileId === profile.id
    );
    return !currentUserMember || (currentUserMember && !currentUserMember.deleted);
  });

  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary-foreground w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3'>
      <NavigationAction />
      <Separator className='h-[2px] dark:bg-zinc-700 bg-white rounded-md w-10 mx-auto' />
      <ScrollArea className='flex-1 w-full'>
        {activeServers && activeServers.length > 0 ? (
          activeServers.map((server: Server) => (
            <div key={server.id} className="mb-4">
              <NavigationItem 
                id={server.id} 
                name={server.name} 
                imageUrl={server.imageUrl} 
              />
            </div>
          ))
        ) : (
          <div>No servers available</div>
        )}
      </ScrollArea>
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ActionTooltip side="right" align='center' label="Toggle Theme">
          <ModeToggle />
        </ActionTooltip>
        <ActionTooltip side="right" align='center' label="User Menu">
          <UserMenu image={profile.imageUrl} />
        </ActionTooltip>
      </div>
    </div>
  );
};

export default NavigationSidebar;