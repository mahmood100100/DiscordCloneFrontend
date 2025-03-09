"use client";

import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/ui/action-tooltip";
import Image from "next/image";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const isActive = params?.serverId === id;

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <div
        className="group relative flex items-center cursor-pointer"
        onClick={() => router.push(`/servers/${id}`)}
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-full transition-all",
            isActive ? "h-[36px] w-[4px]" : "h-[16px] w-[4px]",
            "group-hover:h-[20px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            isActive ? "bg-primary/10 text-primary rounded-[16px]" : "bg-neutral-700"
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt={name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </ActionTooltip>
  );
};

export default NavigationItem;
