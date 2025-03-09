import { Message } from '@/types/message'

export interface Channel {
    id: string;
    type: ChannelType;
    name: string;
    serverId: string;
    profileId: string;
    profileName: string;
    serverName: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

export enum ChannelType {
    TEXT = 0,
    AUDIO = 1,
    VIDEO = 2,
}