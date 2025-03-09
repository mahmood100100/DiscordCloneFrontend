export interface Member {
    id: string;
    role: MemberRole;
    profileId: string;
    serverId: string;
    profileName: string;
    profileImageUrl: string;
    profileEmail: string;
    serverName: string;
    createdAt: string;
    updatedAt: string;
    deleted : boolean;
}

export enum MemberRole {
    ADMIN = 0,
    MODERATOR = 1,
    GUEST = 2,
}