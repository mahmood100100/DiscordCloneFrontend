"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import NavigationSidebar from "./navigations/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import SettingsSidebar from "./settings/settings-sidebar";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MobileToggle = ({ serverId }: { serverId?: string }) => {
  const isMobile = !serverId;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        className={cn("flex gap-0 p-0", isMobile && "w-72")}
        side="left"
      >
        <VisuallyHidden asChild>
          <SheetTitle>
            {serverId ? "Server Navigation" : "Settings Navigation"}
          </SheetTitle>
        </VisuallyHidden>

        <VisuallyHidden asChild>
          <SheetDescription>
            {serverId
              ? "Browse channels and members of the server."
              : "Adjust your account settings and preferences."}
          </SheetDescription>
        </VisuallyHidden>

        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <div className="relative flex-1">
          {serverId ? (
            <ServerSidebar serverId={serverId} isMobile={true} />
          ) : (
            <SettingsSidebar isMobile={true} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;