"use client"
import qs from "query-string"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Video, VideoOff } from "lucide-react"
import ActionTooltip from "@/components/ui/action-tooltip"

export const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const SearchParams = useSearchParams();
    const isVideo = SearchParams?.get("video");
    const Icon = isVideo ? VideoOff : Video;
    const toolTipLabel = isVideo ? "End video call" : "Start video call";

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        }, { skipNull: true })

        router.push(url);
    }

    return (

        <ActionTooltip side="bottom" label={toolTipLabel}>
            <button className="hover:opacity-75 transition mr-4" onClick={onClick}>
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>

    );
}
