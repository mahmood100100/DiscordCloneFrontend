import { DirectMessage } from "@/types/direct-message";

export interface Conversation {
    id: string;
    memberOneId: string;
    memberTwoId: string;
    createdAt: string;
    directMessages: DirectMessage[];
}