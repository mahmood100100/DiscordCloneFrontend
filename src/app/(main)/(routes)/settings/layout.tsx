"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SettingsSidebar from "@/components/settings/settings-sidebar";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MobileToggle from "@/components/mobile-toggle";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const router = useRouter();
  const serverId = useSelector((state: RootState) => state.server.servers[0]?.id);

  return (
    <div className="settings-layout-container dark:bg-[#25282B] bg-zinc-100 h-screen flex">
      <SettingsSidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-[#313338] p-6">
          <div className="flex items-center">
            <MobileToggle />
            <div
              onClick={() => router.push(`/servers/${serverId}`)}
              className="flex items-center space-x-1 text-sm text-zinc-700 hover:text-zinc-950 dark:text-zinc-100 dark:hover:text-zinc-300 transition cursor-pointer ml-4"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-[#313338] flex items-center justify-center overflow-hidden px-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;