import { Channel } from "@/types/channel";
import { Member } from "@/types/member";

export interface Server {
    id : string;
    imageUrl : string;
    name : string;
    inviteCode : string;
    profileId : string;
    prfoileUserName : string;
    channels : Channel[];
    members : Member[];
    createdAt : string;
    updatedAt : string;
}

export interface ServerCreation {
    name : string;
    image : File | undefined;
    profileId : string;
}