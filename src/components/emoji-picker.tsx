"use client"
import { Smile } from 'lucide-react';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

interface EmojiPickerProps {
    onChange : (value: string) => void;
}
const EmojiPicker = ({onChange} : EmojiPickerProps) => {
    const {resolvedTheme} = useTheme();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'/>
            </PopoverTrigger>
            <PopoverContent 
                side={isMobile ? 'bottom' : 'top'} 
                align={isMobile ? 'center' : 'end'}
                sideOffset={isMobile ? 5 : 10} 
                alignOffset={0}
                className='bg-transparent border-none shadow-none drop-shadow-none p-0'
                style={{
                    maxWidth: isMobile ? '95vw' : 'min(350px, 90vw)',
                    maxHeight: isMobile ? '50vh' : 'min(400px, 60vh)',
                    width: isMobile ? '95vw' : 'auto'
                }}
            >
               <Picker 
                   theme={resolvedTheme} 
                   data={data} 
                   onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                   set='native'
                   previewPosition='none'
                   skinTonePosition='none'
                   style={{
                       width: '100%',
                       height: '100%'
                   }}
               />
            </PopoverContent>
        </Popover>
    )
}

export default EmojiPicker