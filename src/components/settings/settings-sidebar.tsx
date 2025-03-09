"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { User, Lock } from "lucide-react";
import { Separator } from "../ui/separator";

type SettingsSidebarProps = {
  isMobile?: boolean;
};

const SettingsSidebar = ({ isMobile = false }: SettingsSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isUserInfoActive = pathname === "/settings/user-info";
  const isUserPasswordActive = pathname === "/settings/user-password";

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      className={cn(
        "h-full dark:bg-[#25282B] bg-zinc-100 p-6 flex-shrink-0 flex flex-col overflow-hidden",
        !isMobile && "hidden lg:flex w-60"
      )}
    >
      <h2
        className={cn(
          "text-2xl font-semibold transition",
          "text-zinc-700 dark:text-zinc-200",
        )}
      >
        Settings
      </h2>
      <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
      <nav className="space-y-1">
        {isMobile ? (
          <>
            <SheetClose asChild>
              <Button
                onClick={() => handleNavigation("/settings/user-info")}
                className={cn(
                  "group px-2 py-2 rounded-md flex justify-start items-center gap-x-2 w-full transition mb-1",
                  isUserInfoActive
                    ? "bg-zinc-700/20 dark:bg-zinc-700 text-primary dark:text-zinc-200 hover:bg-zinc-700/30 dark:hover:bg-zinc-700/75"
                    : "bg-transparent text-zinc-500 hover:bg-zinc-700/10 dark:text-zinc-400 dark:hover:bg-zinc-700/50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                )}
                variant="ghost"
              >
                <User size={20} className="flex-shrink-0 w-5 h-5" />
                <span className="ml-1 font-semibold text-sm">User Info</span>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                onClick={() => handleNavigation("/settings/user-password")}
                className={cn(
                  "group px-2 py-2 rounded-md flex justify-start items-center gap-x-2 w-full transition mb-1",
                  isUserPasswordActive
                    ? "bg-zinc-700/20 dark:bg-zinc-700 text-primary dark:text-zinc-200 hover:bg-zinc-700/30 dark:hover:bg-zinc-700/75"
                    : "bg-transparent text-zinc-500 hover:bg-zinc-700/10 dark:text-zinc-400 dark:hover:bg-zinc-700/50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                )}
                variant="ghost"
              >
                <Lock size={20} className="flex-shrink-0 w-5 h-5" />
                <span className="ml-1 font-semibold text-sm">Password</span>
              </Button>
            </SheetClose>
          </>
        ) : (
          <>
            <Button
              onClick={() => handleNavigation("/settings/user-info")}
              className={cn(
                "group px-2 py-2 rounded-md flex justify-start items-center gap-x-2 w-full transition mb-1",
                isUserInfoActive
                  ? "bg-zinc-700/20 dark:bg-zinc-700 text-primary dark:text-zinc-200 hover:bg-zinc-700/30 dark:hover:bg-zinc-700/75"
                  : "bg-transparent text-zinc-500 hover:bg-zinc-700/10 dark:text-zinc-400 dark:hover:bg-zinc-700/50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              )}
              variant="ghost"
            >
              <User size={20} className="flex-shrink-0 w-5 h-5" />
              <span className="ml-1 font-semibold text-sm">User Info</span>
            </Button>
            <Button
              onClick={() => handleNavigation("/settings/user-password")}
              className={cn(
                "group px-2 py-2 rounded-md flex justify-start items-center gap-x-2 w-full transition mb-1",
                isUserPasswordActive
                  ? "bg-zinc-700/20 dark:bg-zinc-700 text-primary dark:text-zinc-200 hover:bg-zinc-700/30 dark:hover:bg-zinc-700/75"
                  : "bg-transparent text-zinc-500 hover:bg-zinc-700/10 dark:text-zinc-400 dark:hover:bg-zinc-700/50 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
              )}
              variant="ghost"
            >
              <Lock size={20} className="flex-shrink-0 w-5 h-5" />
              <span className="ml-1 font-semibold text-sm">Password</span>
            </Button>
          </>
        )}
      </nav>
    </div>
  );
};

export default SettingsSidebar;