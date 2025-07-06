import { Permission, PermissionCheck, PermissionGroup } from "@/types/permissions";
import { MemberRole } from "@/types/member";
import { Member } from "@/types/member";
import { Channel } from "@/types/channel";

// Define permission sets for each role
export const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  [MemberRole.ADMIN]: [
    Permission.MANAGE_SERVER,
    Permission.DELETE_SERVER,
    Permission.CREATE_CHANNEL,
    Permission.EDIT_CHANNEL,
    Permission.DELETE_CHANNEL,
    Permission.MANAGE_MEMBERS,
    Permission.KICK_MEMBERS,
    Permission.SEND_MESSAGES,
    Permission.EDIT_MESSAGES,
    Permission.DELETE_MESSAGES,
  ],
  [MemberRole.MODERATOR]: [
    Permission.CREATE_CHANNEL,
    Permission.EDIT_CHANNEL,
    Permission.DELETE_CHANNEL,
    Permission.KICK_MEMBERS,
    Permission.SEND_MESSAGES,
    Permission.EDIT_MESSAGES,
    Permission.DELETE_MESSAGES,
  ],
  [MemberRole.GUEST]: [
    Permission.SEND_MESSAGES,
    Permission.EDIT_MESSAGES,
    Permission.DELETE_MESSAGES,
  ],
};

// Permission groups for UI display
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: "Server Management",
    description: "Manage server settings and configuration",
    permissions: [
      Permission.MANAGE_SERVER,
      Permission.DELETE_SERVER,
    ],
  },
  {
    name: "Channel Management",
    description: "Create, edit, and delete channels",
    permissions: [
      Permission.CREATE_CHANNEL,
      Permission.EDIT_CHANNEL,
      Permission.DELETE_CHANNEL,
    ],
  },
  {
    name: "Member Management",
    description: "Manage server members and their roles",
    permissions: [
      Permission.MANAGE_MEMBERS,
      Permission.KICK_MEMBERS,
    ],
  },
  {
    name: "Message Management",
    description: "Send, edit, and delete messages",
    permissions: [
      Permission.SEND_MESSAGES,
      Permission.EDIT_MESSAGES,
      Permission.DELETE_MESSAGES,
    ],
  },
];

// Check a single permission
export function checkPermission(
  member: Member,
  permission: Permission,
  channelId?: string,
  targetMember?: Member
): PermissionCheck {
  const memberPermissions = getMemberPermissions(member);
  const hasBasicPermission = memberPermissions.includes(permission);

  switch (permission) {
    case Permission.DELETE_SERVER:
      return {
        hasPermission: hasBasicPermission,
        reason: hasBasicPermission ? undefined : "You don't have permission to delete the server"
      };
    case Permission.DELETE_CHANNEL:
      if (channelId) {
        return {
          hasPermission: hasBasicPermission,
          reason: hasBasicPermission ? undefined : "You don't have permission to delete this channel"
        };
      }
      return {
        hasPermission: hasBasicPermission,
        reason: hasBasicPermission ? undefined : "You don't have permission to delete channels"
      };
    case Permission.EDIT_CHANNEL:
    case Permission.DELETE_CHANNEL:
      if (member.role === MemberRole.MODERATOR && channelId) {
        return {
          hasPermission: hasBasicPermission,
          reason: hasBasicPermission ? undefined : "You can only modify channels you created"
        };
      }
      return {
        hasPermission: hasBasicPermission,
        reason: hasBasicPermission ? undefined : "You don't have permission to modify channels"
      };
    case Permission.KICK_MEMBERS:
      if (targetMember && member.role >= targetMember.role) {
        return {
          hasPermission: false,
          reason: "You cannot kick members with equal or higher role"
        };
      }
      return {
        hasPermission: hasBasicPermission,
        reason: hasBasicPermission ? undefined : "You don't have permission to kick members"
      };
    default:
      return {
        hasPermission: hasBasicPermission,
        reason: hasBasicPermission ? undefined : "You don't have permission to perform this action"
      };
  }
}

// Check multiple permissions
export function checkMultiplePermissions(
  member: Member,
  permissions: Permission[],
  channelId?: string,
  targetMember?: Member
): PermissionCheck {
  for (const permission of permissions) {
    const check = checkPermission(member, permission, channelId, targetMember);
    if (!check.hasPermission) {
      return check;
    }
  }
  return {
    hasPermission: true
  };
}

// Channel-specific permission checks
export function canEditChannel(member: Member, channel: Channel, profileId?: string): boolean {
  if (!member || !channel) return false;
  if (member.role === MemberRole.ADMIN) return true;
  if (member.role === MemberRole.MODERATOR) {
    const isCreator = channel.profileId === profileId;
    return isCreator && getMemberPermissions(member).includes(Permission.EDIT_CHANNEL);
  }
  return false;
}

export function canDeleteChannel(member: Member, channel: Channel, profileId?: string): boolean {
  if (!member || !channel) return false;
  if (member.role === MemberRole.ADMIN) return true;
  if (member.role === MemberRole.MODERATOR) {
    const isCreator = channel.profileId === profileId;
    return isCreator && getMemberPermissions(member).includes(Permission.DELETE_CHANNEL);
  }
  return false;
}

export function canModifyChannel(member: Member, channel: Channel, profileId?: string): boolean {
  if (!member || !channel) return false;
  if (member.role === MemberRole.ADMIN) return true;
  if (member.role === MemberRole.MODERATOR) {
    const isCreator = channel.profileId === profileId;
    const hasEditPermission = getMemberPermissions(member).includes(Permission.EDIT_CHANNEL);
    const hasDeletePermission = getMemberPermissions(member).includes(Permission.DELETE_CHANNEL);
    return isCreator && (hasEditPermission || hasDeletePermission);
  }
  return false;
}

// Get permission description
export function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    [Permission.MANAGE_SERVER]: "Manage server settings and configuration",
    [Permission.DELETE_SERVER]: "Delete the server",
    [Permission.CREATE_CHANNEL]: "Create new channels",
    [Permission.EDIT_CHANNEL]: "Edit channel settings",
    [Permission.DELETE_CHANNEL]: "Delete channels",
    [Permission.MANAGE_MEMBERS]: "Manage server members",
    [Permission.KICK_MEMBERS]: "Kick members from the server",
    [Permission.SEND_MESSAGES]: "Send messages in text channels",
    [Permission.EDIT_MESSAGES]: "Edit your own messages",
    [Permission.DELETE_MESSAGES]: "Delete your own messages",
  };
  return descriptions[permission] || "No description available";
}

// Get permission display name
export function getPermissionDisplayName(permission: Permission): string {
  const names: Record<Permission, string> = {
    [Permission.MANAGE_SERVER]: "Manage Server",
    [Permission.DELETE_SERVER]: "Delete Server",
    [Permission.CREATE_CHANNEL]: "Create Channel",
    [Permission.EDIT_CHANNEL]: "Edit Channel",
    [Permission.DELETE_CHANNEL]: "Delete Channel",
    [Permission.MANAGE_MEMBERS]: "Manage Members",
    [Permission.KICK_MEMBERS]: "Kick Members",
    [Permission.SEND_MESSAGES]: "Send Messages",
    [Permission.EDIT_MESSAGES]: "Edit Messages",
    [Permission.DELETE_MESSAGES]: "Delete Messages",
  };
  return names[permission] || "Unknown Permission";
}

// الحصول على صلاحيات العضو حسب دوره
export function getMemberPermissions(member: Member): Permission[] {
  return ROLE_PERMISSIONS[member.role] || [];
} 