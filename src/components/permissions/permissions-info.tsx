"use client";

import React from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { PermissionsDisplay } from "./permissions-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldAlert, User } from "lucide-react";

interface PermissionsInfoProps {
  serverId: string;
  showDetails?: boolean;
}

export const PermissionsInfo: React.FC<PermissionsInfoProps> = ({
  serverId,
  showDetails = false
}) => {
  const {
    currentMember,
    getMemberPermissionsList,
    isAdmin,
    isModerator,
    canManageServer,
    canDeleteServer,
    canCreateChannel,
    canManageMembers,
    canKickMembers,
    canSendMessages,
  } = usePermissions(serverId);

  if (!currentMember) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Member Permissions
          </CardTitle>
          <CardDescription>
            You are not a member of this server
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const roleIcon = isAdmin ? ShieldAlert : isModerator ? ShieldCheck : Shield;
  const roleColor = isAdmin ? "text-red-500" : isModerator ? "text-indigo-500" : "text-gray-500";
  const roleName = isAdmin ? "Admin" : isModerator ? "Moderator" : "Guest";

  const permissions = getMemberPermissionsList();

  const keyPermissions = [
    { name: "Manage Server", has: canManageServer() },
    { name: "Delete Server", has: canDeleteServer() },
    { name: "Create Channels", has: canCreateChannel() },
    { name: "Manage Members", has: canManageMembers() },
    { name: "Kick Members", has: canKickMembers() },
    { name: "Send Messages", has: canSendMessages() },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(roleIcon, { className: `h-5 w-5 ${roleColor}` })}
            Your Role & Permissions
          </CardTitle>
          <CardDescription>
            Current role and permissions in this server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {roleName}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {permissions.length} permissions
            </span>
          </div>

          {showDetails ? (
            <div className="overflow-y-auto max-h-96">
              <PermissionsDisplay
                permissions={permissions}
                title="All Permissions"
                description="Complete list of your permissions"
                showDescriptions={true}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Key Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {keyPermissions.map(({ name, has }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <div className={`w-2 h-2 rounded-full ${has ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showDetails && (
        <div className="overflow-y-auto max-h-80">
          <Card>
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
              <CardDescription>
                Details about your current role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Role Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium">{roleName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">
                        {new Date(currentMember.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(currentMember.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Permission Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Permissions:</span>
                      <span className="font-medium">{permissions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Server Management:</span>
                      <span className="font-medium">
                        {permissions.filter(p => p.includes('MANAGE_SERVER') || p.includes('DELETE_SERVER')).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Channel Management:</span>
                      <span className="font-medium">
                        {permissions.filter(p => p.includes('CHANNEL')).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Management:</span>
                      <span className="font-medium">
                        {permissions.filter(p => p.includes('MEMBER') || p.includes('KICK')).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Message Management:</span>
                      <span className="font-medium">
                        {permissions.filter(p => p.includes('MESSAGE')).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 