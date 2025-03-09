export interface Message {
    id : string;
    content : string;
    fileUrl : string;
    memberId : string;
    channelId : string;
    memberProfileName : string;
    channelName : string;
    deleted : boolean;
    createdAt : string;
    updatedAt : string;
}