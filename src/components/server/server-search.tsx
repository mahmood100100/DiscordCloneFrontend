"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useParams, useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "../ui/dialog";

interface ServerSearchProps {
    data: {
        label: string;
        type: "member" | "channel";
        data: {
            icon: React.ReactNode;
            name: string;
            id: string;
        }[] | undefined;
    }[];
}

const ServerSearch = ({ data }: ServerSearchProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen((prev) => !prev);
            }
        };

        document.addEventListener("keydown", down, { capture: true });
        return () => {
            document.removeEventListener("keydown", down, { capture: true });
        };
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
        setIsOpen(false);
        if (type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        }
        if (type === "channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
        }

    }

    return (
        <>
            <button
                onClick={handleOpen}
                className="group px-2 py-2 rounded-md flex items-center justify-start gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
            >
                <Search className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs">CTRL</span>K
                </kbd>
            </button>
            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <VisuallyHidden>
                    <DialogTitle></DialogTitle>
                </VisuallyHidden>
                <CommandInput placeholder="Search all channels and members" />
                <CommandList>
                    <CommandEmpty>No Results Found</CommandEmpty>
                    {data.map(({ label, type, data: items }) => {
                        if (!items?.length) return null;

                        return (
                            <CommandGroup key={label} heading={label}>
                                {items.map(({ id, icon, name }) => (
                                    <CommandItem key={id} onSelect={() => { onClick({ id, type }) }}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
};

export default ServerSearch;