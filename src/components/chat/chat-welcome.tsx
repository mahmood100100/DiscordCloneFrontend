import { Hash } from 'lucide-react';
import React from 'react'

interface ChatWelcomeProps {
    name: string;
    type: "channel" | "conversation";
}
const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
    return (
        <div className='space-y-2 mb-4 px-4'>
            {type === "channel" && (
                <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex justify-center items-center'>
                   <Hash className='h-12 w-12 text-white'/>
                </div>
            )}
            <p className='text-xl md:text-3xl font-bold'>
               {type === "channel" ? "Welcome to #" : ""}{name}
            </p>
            <p className='text-sm text-zinc-600 dark:text-zinc-400'>
               {type === "channel" ? `This is the start of the #${name} channel` : `This is the start of your conversation with ${name}`}
            </p>
        </div>
    )
}

export default ChatWelcome