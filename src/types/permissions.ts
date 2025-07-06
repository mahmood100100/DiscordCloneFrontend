export enum Permission {
  // Server Management
  MANAGE_SERVER = "MANAGE_SERVER",
  DELETE_SERVER = "DELETE_SERVER",
  
  // Channel Management
  CREATE_CHANNEL = "CREATE_CHANNEL",
  EDIT_CHANNEL = "EDIT_CHANNEL",
  DELETE_CHANNEL = "DELETE_CHANNEL",
  
  // Member Management
  MANAGE_MEMBERS = "MANAGE_MEMBERS",
  KICK_MEMBERS = "KICK_MEMBERS",
  
  // Message Management
  SEND_MESSAGES = "SEND_MESSAGES",
  EDIT_MESSAGES = "EDIT_MESSAGES",
  DELETE_MESSAGES = "DELETE_MESSAGES",
}

export interface PermissionGroup {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface MemberPermissions {
  memberId: string;
  serverId: string;
  role: number; // MemberRole enum value
  permissions: Permission[];
  overrides: {
    [channelId: string]: {
      allowed: Permission[];
      denied: Permission[];
    };
  };
}

export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
  overriddenBy?: string;
} 