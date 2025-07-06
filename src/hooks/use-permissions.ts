import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Member } from "@/types/member";
import { Permission } from "@/types/permissions";
import { Channel } from "@/types/channel";
import { 
  checkPermission, 
  checkMultiplePermissions, 
  getMemberPermissions,
  getPermissionDescription,
  getPermissionDisplayName,
  PERMISSION_GROUPS,
  canEditChannel as canEditChannelLib,
  canDeleteChannel as canDeleteChannelLib,
  canModifyChannel as canModifyChannelLib
} from "@/lib/permissions";

export const usePermissions = (serverId?: string) => {
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const server = useSelector((state: RootState) => 
    state.server.servers.find(s => s.id === serverId)
  );
  
  const currentMember = useMemo(() => {
    if (!server || !profile) return null;
    return server.members.find(member => member.profileId === profile.id);
  }, [server, profile]);

  const hasPermission = (
    permission: Permission,
    channelId?: string,
    targetMember?: Member
  ) => {
    if (!currentMember) return false;
    const check = checkPermission(currentMember, permission, channelId, targetMember);
    return check.hasPermission;
  };

  const hasAnyPermission = (permissions: Permission[], channelId?: string, targetMember?: Member) => {
    if (!currentMember) return false;
    return permissions.some(permission => 
      checkPermission(currentMember, permission, channelId, targetMember).hasPermission
    );
  };

  const hasAllPermissions = (permissions: Permission[], channelId?: string, targetMember?: Member) => {
    if (!currentMember) return false;
    const check = checkMultiplePermissions(currentMember, permissions, channelId, targetMember);
    return check.hasPermission;
  };

  const getMemberPermissionsList = () => {
    if (!currentMember) return [];
    return getMemberPermissions(currentMember);
  };

  const getPermissionInfo = (permission: Permission) => {
    return {
      name: getPermissionDisplayName(permission),
      description: getPermissionDescription(permission),
      hasPermission: hasPermission(permission)
    };
  };

  // دوال جديدة للتحقق من صلاحيات القنوات المحددة
  const canEditSpecificChannel = (channel: Channel) => {
    if (!currentMember || !channel) return false;
    return canEditChannelLib(currentMember, channel, profile?.id);
  };

  const canDeleteSpecificChannel = (channel: Channel) => {
    if (!currentMember || !channel) return false;
    return canDeleteChannelLib(currentMember, channel, profile?.id);
  };

  const canModifySpecificChannel = (channel: Channel) => {
    if (!currentMember || !channel) return false;
    return canModifyChannelLib(currentMember, channel, profile?.id);
  };

  // Server permissions
  const canManageServer = () => hasPermission(Permission.MANAGE_SERVER);
  const canDeleteServer = () => hasPermission(Permission.DELETE_SERVER);
  const canCreateChannel = () => hasPermission(Permission.CREATE_CHANNEL);
  const canEditChannel = (channelId?: string) => hasPermission(Permission.EDIT_CHANNEL, channelId);
  const canDeleteChannel = (channelId?: string) => hasPermission(Permission.DELETE_CHANNEL, channelId);
  const canManageMembers = () => hasPermission(Permission.MANAGE_MEMBERS);
  const canKickMembers = (targetMember?: Member) => hasPermission(Permission.KICK_MEMBERS, undefined, targetMember);
  
  // Message permissions
  const canSendMessages = () => hasPermission(Permission.SEND_MESSAGES);
  const canEditMessages = () => hasPermission(Permission.EDIT_MESSAGES);
  const canDeleteMessages = () => hasPermission(Permission.DELETE_MESSAGES);
  
  // Thread permissions (if needed)
  const canSendMessagesInThreads = () => hasPermission(Permission.SEND_MESSAGES);

  return {
    // Basic permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Member info
    currentMember,
    getMemberPermissionsList,
    getPermissionInfo,
    
    // Permission groups
    permissionGroups: PERMISSION_GROUPS,
    
    // Channel-specific permission checks
    canEditSpecificChannel,
    canDeleteSpecificChannel,
    canModifySpecificChannel,
    
    // Specific permission checks
    canManageServer,
    canDeleteServer,
    canCreateChannel,
    canEditChannel,
    canDeleteChannel,
    canManageMembers,
    canKickMembers,
    canSendMessages,
    canEditMessages,
    canDeleteMessages,
    canSendMessagesInThreads,
    
    // Role-based checks
    isAdmin: currentMember?.role === 0,
    isModerator: currentMember?.role === 1,
    isGuest: currentMember?.role === 2,
  };
}; 