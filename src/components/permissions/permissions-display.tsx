"use client";

import React from "react";
import { Permission } from "@/types/permissions";
import { PERMISSION_GROUPS, getPermissionDisplayName, getPermissionDescription } from "@/lib/permissions";
import { Check, X, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PermissionsDisplayProps {
  permissions: Permission[];
  title?: string;
  description?: string;
  showDescriptions?: boolean;
  compact?: boolean;
}

export const PermissionsDisplay: React.FC<PermissionsDisplayProps> = ({
  permissions,
  title = "Permissions",
  description,
  showDescriptions = false,
  compact = false
}) => {
  const groupedPermissions = PERMISSION_GROUPS.map(group => ({
    ...group,
    permissions: group.permissions.filter(permission => 
      permissions.includes(permission)
    )
  })).filter(group => group.permissions.length > 0);

  if (compact) {
    return (
      <div className="space-y-2">
        {title && (
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">{title}</h3>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {permissions.map(permission => (
            <Badge key={permission} variant="secondary" className="text-xs">
              {getPermissionDisplayName(permission)}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="outline">{permissions.length}</Badge>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {groupedPermissions.map((group, index) => (
          <div key={group.name}>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {group.name}
              </h4>
              <Badge variant="outline" className="text-xs">
                {group.permissions.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {group.permissions.map(permission => (
                <div
                  key={permission}
                  className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                >
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {getPermissionDisplayName(permission)}
                    </p>
                    {showDescriptions && (
                      <p className="text-xs text-muted-foreground truncate">
                        {getPermissionDescription(permission)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {index < groupedPermissions.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface PermissionComparisonProps {
  currentPermissions: Permission[];
  targetPermissions: Permission[];
  title?: string;
}

export const PermissionComparison: React.FC<PermissionComparisonProps> = ({
  currentPermissions,
  targetPermissions,
  title = "Permission Comparison"
}) => {
  const allPermissions = [...new Set([...currentPermissions, ...targetPermissions])];
  
  const groupedPermissions = PERMISSION_GROUPS.map(group => ({
    ...group,
    permissions: group.permissions.filter(permission => 
      allPermissions.includes(permission)
    )
  })).filter(group => group.permissions.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Compare current permissions with target permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {groupedPermissions.map((group, index) => (
          <div key={group.name}>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                {group.name}
              </h4>
            </div>
            <div className="space-y-2">
              {group.permissions.map(permission => {
                const hasCurrent = currentPermissions.includes(permission);
                const hasTarget = targetPermissions.includes(permission);
                
                return (
                  <div
                    key={permission}
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {getPermissionDisplayName(permission)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Current:</span>
                        {hasCurrent ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">Target:</span>
                        {hasTarget ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {index < groupedPermissions.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}; 