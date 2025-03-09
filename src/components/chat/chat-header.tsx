import { Hash } from 'lucide-react';
import React from 'react'
import MobileToggle from '@/components/mobile-toggle';
import UserAvatar from '../user-avatar';
import SignalrIndicator from '../signalr-indicator';
import { ChatVideoButton } from './chat-video-button';


interface ChatHeaderProps {
    serverId: string;
    name: string;
    type : "conversation" | "channel";
    imageUrl?: string;
}
const ChatHeader = ({serverId , name , type , imageUrl} : ChatHeaderProps) => {
  return (
    <div className='text-base font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
        <MobileToggle serverId= {serverId}/>
        {type === "channel" && (
            <Hash className='h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2'/>
        )}
        {type === "conversation" && (
          <UserAvatar className='h-8 w-8 md:h-8 md:w-8 mr-2' src= {imageUrl}/>
        )}
        <p className='text-base font-semibold text-black dark:text-white'>
            {name}
        </p>

        <div className='ml-auto flex items-center'>
          {type === "conversation" && (
            <ChatVideoButton/>
          )}
          <div>
          <SignalrIndicator/>

          </div>

        </div>
    </div>
  )
}

export default ChatHeader