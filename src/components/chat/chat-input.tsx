"use client";
import { createMessageSchema } from "@/schema/message";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { addChannelMessage } from "@/redux/slices/server-slice";
import { addDirectMessageSuccess } from "@/redux/slices/conversation-slice";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Send } from "lucide-react";
import { createMessageApiCall } from "@/lib/message";
import { createDirectMessageApiCall } from "@/lib/direct-message";
import toast from "react-hot-toast";
import MessageFilePreview from "./message-file-preview";
import EmojiPicker from "../emoji-picker";

interface ChatInputProps {
  query: {
    channelId?: string;
    serverId?: string;
    memberId?: string;
    conversationId?: string;
    senderMemberId?: string;
    receiverMemberId?: string;
  };
  name: string;
  type: "conversation" | "channel";
}

const ChatInput = ({ query, name, type }: ChatInputProps) => {
  const dispatch = useDispatch();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof createMessageSchema>>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      file: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const selectedFile = form.watch("file");

  const onSubmit = async (value: z.infer<typeof createMessageSchema>) => {
    try {
      const formData = new FormData();
      formData.append("content", value.content);
      if (value.file instanceof File) {
        formData.append("file", value.file);
      }

      if (type === "channel") {
        if (!query.channelId || !query.memberId || !query.serverId) {
          toast.error("Missing required channel fields");
          return;
        }

        formData.append("channelId", query.channelId);
        formData.append("memberId", query.memberId);
        formData.append("serverId", query.serverId);

        const response = await createMessageApiCall(formData);
        if (response.success) {
          dispatch(
            addChannelMessage({
              serverId: query.serverId,
              channelId: query.channelId,
              message: response.result,
            })
          );
          toast.success("Message sent successfully!");
          form.reset();
        } else {
          toast.error(response.error || "Failed to send message");
        }
      } else if (type === "conversation") {
        if (!query.conversationId || !query.senderMemberId || !query.receiverMemberId) {
          toast.error("Missing required conversation fields");
          return;
        }

        formData.append("conversationId", query.conversationId);
        formData.append("senderMemberId", query.senderMemberId);
        formData.append("receiverMemberId", query.receiverMemberId);

        const response = await createDirectMessageApiCall(formData);
        if (response.success) {
          dispatch(
            addDirectMessageSuccess({
              conversationId: query.conversationId,
              directMessage: response.result,
            })
          );
          toast.success("Message sent successfully!");
          form.reset();
        } else {
          toast.error(response.error || "Failed to send message");
        }
      }
    } catch (err) {
      toast.error("An error occurred while sending the message");
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
    }
  };

  const handleRemoveFile = () => {
    form.setValue("file", undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative p-4 pb-6 space-y-2">
        {selectedFile && (
          <div className="w-fit mb-2">
            <MessageFilePreview file={selectedFile} onRemove={handleRemoveFile} />
          </div>
        )}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleFileButtonClick}
                    className="absolute top-1/2 left-3 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center transform -translate-y-1/2"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <Input
                    disabled={isLoading}
                    className="pl-12 py-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 w-full"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} />
                    <button
                      type="submit"
                      disabled={isLoading || !field.value.trim()}
                      className="h-[24px] w-[24px] bg-transparent flex items-center justify-center"
                    >
                      <Send className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;