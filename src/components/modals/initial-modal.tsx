"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { serverCreationSchema } from "@/schema/server";
import FileUpload from "../file-upload";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ServerCreation } from "@/types/server";
import { createServerApiCall } from "@/lib/server";

const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { user } = useSelector((state: any) => state.auth);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const serverForm = useForm({
        resolver: zodResolver(serverCreationSchema),
        defaultValues: {
            name: "",
            image: undefined,
        },
    });

    const isLoading = serverForm.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof serverCreationSchema>) => {
        try {
            if (!user?.profile?.id) {
                toast.error("Profile ID not found");
                return;
            }

            const server: ServerCreation = {
                name: values.name,
                image: values.image,
                profileId: user.profile.id
            };

            const response = await createServerApiCall(server);

            if (response.success) {
                toast.success(response.message || "Server created successfully");
                serverForm.reset();
                router.refresh();
                window.location.reload();

            } else {
                toast.error(response.error || "Server creation failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Server creation failed");
        }
    };

    if (!isMounted) {
        return null;
    }
    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always
                        change it later.
                    </DialogDescription>
                </DialogHeader>

                <Form {...serverForm}>
                    <form onSubmit={serverForm.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={serverForm.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={serverForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primery">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default InitialModal;
