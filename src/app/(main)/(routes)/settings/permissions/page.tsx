"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PermissionsInfo } from "@/components/permissions/permissions-info";
import { PermissionsDisplay } from "@/components/permissions/permissions-display";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Info, Shield, ShieldCheck, ShieldAlert, Server } from "lucide-react";
import { MemberRole } from "@/types/member";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const PermissionsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [selectedServerId, setSelectedServerId] = useState<string>(() => {
    // محاولة الحصول على serverId من URL أو search params
    return (params?.serverId as string) || searchParams?.get('serverId') || '';
  });
  const [showDetails, setShowDetails] = useState(false);
  
  // الحصول على قائمة الخوادم من Redux
  const servers = useSelector((state: RootState) => state.server.servers);
  const { currentMember } = usePermissions(selectedServerId);

  // إذا لم يتم اختيار خادم
  if (!selectedServerId) {
    return (
      <div className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 max-w-full overflow-hidden">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Server Permissions</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Select a server to view your permissions
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="text-sm sm:text-base md:text-lg">Select Server</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Choose a server to view your permissions and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Server</label>
                <select 
                  value={selectedServerId} 
                  onChange={(e) => setSelectedServerId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white text-black text-xs sm:text-sm"
                >
                  <option value="">Select a server</option>
                  {servers.map((server) => (
                    <option key={server.id} value={server.id}>
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {servers.length === 0 && (
                <div className="text-center py-4 sm:py-6 md:py-8">
                  <Info className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-2 sm:mb-3 md:mb-4" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    You are not a member of any servers yet.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // إذا لم يكن العضو في الخادم المحدد
  if (!currentMember) {
    return (
      <div className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Server Permissions</h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate">
              View your permissions in the selected server
            </p>
          </div>
          <select 
            value={selectedServerId} 
            onChange={(e) => setSelectedServerId(e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white text-black text-xs sm:text-sm"
          >
            {servers.map((server) => (
              <option key={server.id} value={server.id}>
                {server.name}
              </option>
            ))}
          </select>
        </div>
        
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              <span className="text-sm sm:text-base md:text-lg">Not a Member</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              You are not a member of this server
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const selectedServer = servers.find(s => s.id === selectedServerId);
  const roleInfo = [
    {
      role: MemberRole.ADMIN,
      name: "Admin",
      icon: ShieldAlert,
      color: "text-red-500",
      description: "Full server control with all permissions",
      permissions: ROLE_PERMISSIONS[MemberRole.ADMIN]
    },
    {
      role: MemberRole.MODERATOR,
      name: "Moderator",
      icon: ShieldCheck,
      color: "text-indigo-500",
      description: "Moderate server content and manage channels",
      permissions: ROLE_PERMISSIONS[MemberRole.MODERATOR]
    },
    {
      role: MemberRole.GUEST,
      name: "Guest",
      icon: Shield,
      color: "text-gray-500",
      description: "Basic member with limited permissions",
      permissions: ROLE_PERMISSIONS[MemberRole.GUEST]
    }
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Server Permissions</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate">
            View and understand your permissions in {selectedServer?.name}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <select 
            value={selectedServerId} 
            onChange={(e) => setSelectedServerId(e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white text-black text-xs sm:text-sm"
          >
            {servers.map((server) => (
              <option key={server.id} value={server.id}>
                {server.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          >
            {showDetails ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
            <span className="hidden sm:inline">{showDetails ? "Hide Details" : "Show Details"}</span>
            <span className="sm:hidden">{showDetails ? "Hide" : "Show"}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="current" className="space-y-3 sm:space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="current" className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-2 md:px-3">Your Permissions</TabsTrigger>
          <TabsTrigger value="roles" className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-2 md:px-3">Role Comparison</TabsTrigger>
          <TabsTrigger value="help" className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-2 md:px-3">Help & Info</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-3 sm:space-y-4">
          <PermissionsInfo serverId={selectedServerId} showDetails={showDetails} />
        </TabsContent>

        <TabsContent value="roles" className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Role Permissions Comparison</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Compare permissions across different roles
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {roleInfo.map((role) => {
                  const Icon = role.icon;
                  const isCurrentRole = currentMember.role === role.role;
                  
                  return (
                    <Card key={role.role} className={`${isCurrentRole ? 'ring-2 ring-primary' : ''}`}>
                      <CardHeader className="pb-2 sm:pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Icon className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${role.color} flex-shrink-0`} />
                          <CardTitle className="text-sm sm:text-base md:text-lg truncate">{role.name}</CardTitle>
                          {isCurrentRole && (
                            <Badge variant="default" className="text-xs flex-shrink-0">
                              Current
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-xs sm:text-sm">
                          {role.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-2 sm:p-4">
                        <PermissionsDisplay
                          permissions={role.permissions}
                          compact={true}
                          showDescriptions={false}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Understanding Permissions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Learn how permissions work in this server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">How Permissions Work</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    Permissions determine what actions you can perform in the server. 
                    They are based on your role and can be customized by server administrators.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm md:text-md font-medium mb-1 sm:mb-2">Role Hierarchy</h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <ShieldAlert className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                      <span className="font-medium">Admin</span>
                      <span className="text-muted-foreground">- Highest level, full control</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-500 flex-shrink-0" />
                      <span className="font-medium">Moderator</span>
                      <span className="text-muted-foreground">- Moderate content and manage channels</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium">Guest</span>
                      <span className="text-muted-foreground">- Basic member with limited permissions</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm md:text-md font-medium mb-1 sm:mb-2">Channel Permissions</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Some permissions are specific to channels. Moderators can only modify channels they created, 
                    while admins can modify any channel.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm md:text-md font-medium mb-1 sm:mb-2">Getting Help</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    If you need additional permissions or have questions about your current permissions, 
                    contact a server administrator.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermissionsPage; 