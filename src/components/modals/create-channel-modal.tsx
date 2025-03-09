import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { channelCreationSchema } from "@/schema/channel";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/use-modal-store";
import { Channel } from "@/types/channel";
import { z } from "zod";
import { createChannelApiCall } from "@/lib/channel";
import { addServerChannel } from "@/redux/slices/server-slice";
import { useRouter } from "next/navigation";

const CreateChannelModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, data, type } = useModal();
    const isModalOpen = isOpen && type === "createChannel";
    const server = useSelector((state: RootState) => state.server.servers.find((server) => server.id === data.server?.id));
    const profile = useSelector((state: RootState) => state.auth.user?.profile);
    const dispatch = useDispatch();
    const router = useRouter();

    const channelForm = useForm<z.infer<typeof channelCreationSchema>>({
        resolver: zodResolver(channelCreationSchema),
        defaultValues: {
            name: "",
            type: data.channelType || 0,
        },
    });

    const isChannelNameUnique = (name: string) => {
        return !server?.channels.some((channel) => channel.name === name);
    };

    const onSubmit: SubmitHandler<z.infer<typeof channelCreationSchema>> = async (values) => {
        try {
            setIsLoading(true);
            if (!profile?.id) {
                toast.error("Profile ID not found. Please try again.");
                return;
            }

            if (!isChannelNameUnique(values.name)) {
                toast.error("A channel with this name already exists.");
                return;
            }

            const response = await createChannelApiCall(
                profile.id,
                values.name,
                values.type,
                server?.id || ""
            );

            if (response.success) {
                const channel: Channel = response.result;
                dispatch(addServerChannel({ serverId: server?.id || "", channel }));
                toast.success(response.message || "Channel created successfully!");
                channelForm.reset();
                router.refresh();
                onClose();
            } else {
                toast.error(response.error || "Channel creation failed. Please try again.");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        channelForm.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create a Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Create a new channel for your server. Choose a name and type to get started.
                    </DialogDescription>
                </DialogHeader>

                <Form {...channelForm}>
                    <form onSubmit={channelForm.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={channelForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={channelForm.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Channel Type
                                        </FormLabel>
                                        <FormControl>
                                            <select
                                                value={field.value}
                                                onChange={(e) => field.onChange(Number(e.target.value) as 0 | 1 | 2)}
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 w-full p-2 rounded-md"
                                            >
                                                <option value={0}>Text</option>
                                                <option value={1}>Voice</option>
                                                <option value={2}>Video</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button
                                variant="primery"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;