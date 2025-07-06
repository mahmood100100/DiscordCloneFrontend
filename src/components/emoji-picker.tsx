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
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsSmallScreen(width < 480);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'/>
            </PopoverTrigger>
            <PopoverContent 
                side={isMobile ? 'bottom' : 'top'} 
                align={isSmallScreen ? 'start' : (isMobile ? 'center' : 'end')}
                sideOffset={isMobile ? 5 : 10} 
                alignOffset={0}
                className='bg-transparent border-none shadow-none drop-shadow-none p-0'
                style={{
                    maxWidth: isSmallScreen ? '99vw' : (isMobile ? '98vw' : 'min(350px, 90vw)'),
                    maxHeight: isSmallScreen ? '40vh' : (isMobile ? '45vh' : 'min(400px, 60vh)'),
                    width: isSmallScreen ? '99vw' : (isMobile ? '98vw' : 'auto'),
                    left: isSmallScreen ? '0.5vw' : (isMobile ? '1vw' : 'auto'),
                    right: isSmallScreen ? '0.5vw' : (isMobile ? '1vw' : 'auto'),
                    transform: isSmallScreen ? 'translateX(0)' : 'none'
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