"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Channel } from "@/types/channel";
import { channelEditionSchema } from "@/schema/channel";
import { updateChannelApiCall } from "@/lib/channel";
import { z } from "zod";
import { usePermissions } from "@/hooks/use-permissions";
import { useModal } from "@/hooks/use-modal-store";
import { updateServerChannel } from "@/redux/slices/server-slice";

const EditChannelModal = () => {
  const { isOpen, onClose, data, type } = useModal();
  const isModalOpen = isOpen && type === "editChannel";
  const server = useSelector((state: RootState) => state.server.servers.find((server) => server.id === data.server?.id));
  const channel: Channel | undefined = server?.channels.find((channel) => channel.id === data.channel?.id);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.auth.user?.profile);

  // استخدام hook الصلاحيات للتحقق من صلاحيات تعديل القناة
  const { canEditSpecificChannel } = usePermissions(server?.id);

  const form = useForm({
    resolver: zodResolver(channelEditionSchema),
    defaultValues: {
      name: channel?.name || "",
    },
  });

  // التحقق من صلاحيات تعديل القناة باستخدام الدالة الجديدة
  const canEditThisChannel = useCallback(() => {
    if (!channel) return false;
    return canEditSpecificChannel(channel);
  }, [channel, canEditSpecificChannel]);

  const isChannelNameUnique = (name: string, channelId?: string) => {
    return !server?.channels.some(
      (channel) => channel.name.toLowerCase() === name.toLowerCase() && channel.id !== channelId
    );
  };

  useEffect(() => {
    if (channel?.name) {
      form.setValue("name", channel.name);
    }
  }, [channel, form]);

  // التحقق من الصلاحيات عند فتح المودال
  useEffect(() => {
    if (isModalOpen && !canEditThisChannel()) {
      toast.error("You don&apos;t have permission to edit this channel");
      onClose();
    }
  }, [isModalOpen, canEditThisChannel, onClose]);

  const onSubmit = async (data: z.infer<typeof channelEditionSchema>) => {
    // التحقق من الصلاحيات مرة أخرى قبل التقديم
    if (!canEditThisChannel()) {
      toast.error("You don&apos;t have permission to edit this channel");
      return;
    }

    setLoading(true);
    try {
      if (!isChannelNameUnique(data.name)) {
        toast.error("A channel with this name already exists.");
        return;
      }

      const response = await updateChannelApiCall(profile?.id || "", channel?.id || "" , data.name , server?.id || "");

      if (response.success) {
        toast.success("Channel updated successfully!");
        dispatch(updateServerChannel({serverId : server?.id || "" , channel : response.result}));
        onClose();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error updating channel", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // إذا لم يكن لديه صلاحية، لا نعرض المودال
  if (!canEditThisChannel()) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Your Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Update your channel&apos;s name to keep it fresh. You can always modify these settings later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 px-6">
            <div>
              <label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Channel Name
              </label>
              <Input
                {...form.register("name")}
                type="text"
                placeholder="Enter a new server name"
                className="bg-zinc-300/50 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              />
            </div>
          </div>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <Button disabled={loading} variant="primery">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;
