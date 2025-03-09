export interface DirectMessage {
    id: string;
    content: string;
    fileUrl: string | undefined;
    senderMemberId: string;
    receiverMemberId: string;
    conversationId: string;
    senderMemberProfileName: string;
    receiverMemberProfileName: string;
    senderMemberProfileImageUrl: string;
    receiverMemberProfileImageUrl: string;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
}