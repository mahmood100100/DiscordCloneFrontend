"use client";
import { Member, MemberRole } from '@/types/member';
import React, { useEffect, useState } from 'react';
import UserAvatar from '../user-avatar';
import ActionTooltip from '../ui/action-tooltip';
import { ShieldAlert, ShieldCheck, FileText, File, Edit, Trash, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editMessageSchema } from '@/schema/message';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import MessageFilePreview from './message-file-preview';
import { updateMessageApiCall } from '@/lib/message';
import { updateDirectMessageApiCall } from '@/lib/direct-message';
import { useDispatch } from 'react-redux';
import { updateChannelMessage } from '@/redux/slices/server-slice';
import { updateDirectMessageSuccess } from '@/redux/slices/conversation-slice';
import toast from 'react-hot-toast';
import { useModal } from '@/hooks/use-modal-store';
import { useParams, useRouter } from 'next/navigation';
import { DirectMessage } from '@/types/direct-message';
import { Message } from '@/types/message';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member;
  timestamp: string;
  fileUrl?: string;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  query: Record<string, string>;
  messageType?: "channel" | "conversation";
}

const roleIconsMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const getFileType = (url: string) => {
  const fileExtension = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
    return 'image';
  }
  if (fileExtension === 'pdf') {
    return 'pdf';
  }
  return 'file';
};

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  query,
  messageType = "channel",
}: ChatItemProps) => {
  const fileType = fileUrl ? getFileType(fileUrl) : undefined;
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;

  const canDeleteMessage =
  !deleted &&
  (isAdmin
    ? true
    : messageType === "channel"
      ? (isModerator && isOwner)
      : isOwner);
      
  const canEditMessage = !deleted && isOwner;


  const dispatch = useDispatch();
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  const form = useForm<z.infer<typeof editMessageSchema>>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: {
      content: content,
      file: undefined,
    },
  });

  const onMemberClicked = () => {
    if (member.id === currentMember.id) {
      toast.error('You cannot chat with yourself.');
      return;
    } else if (member.deleted) {
      toast.error('This user has been deleted from this server.');
      return;
    }
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [newFile, setNewFile] = useState<File | undefined>(undefined);
  const [existingFileRemoved, setExistingFileRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    form.reset({
      content: content,
      file: undefined,
    });
    setNewFile(undefined);
    setExistingFileRemoved(false);
  }, [content, fileUrl, form]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        setIsEditing(false);
        setNewFile(undefined);
        setExistingFileRemoved(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onSubmit = async (values: z.infer<typeof editMessageSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', values.content);
      formData.append('messageId', id);
      if (newFile) {
        formData.append('file', newFile);
      }
      if (existingFileRemoved && fileUrl) {
        formData.append('removeExistingFile', 'true');
      }

      const response = messageType === "channel"
        ? await updateMessageApiCall(formData)
        : await updateDirectMessageApiCall(formData);

      if (response.success) {
        if (messageType === "channel") {
          dispatch(
            updateChannelMessage({
              serverId: query.serverId || '',
              channelId: query.channelId || '',
              message: response.result as Message,
            })
          );
        } else {
          dispatch(
            updateDirectMessageSuccess({
              conversationId: query.conversationId || '',
              directMessage: response.result as DirectMessage,
            })
          );
        }
        setIsEditing(false);
        setNewFile(undefined);
        setExistingFileRemoved(false);
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error('Something went wrong while updating the message.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      form.setValue('file', file);
    }
  };

  const removeNewFile = () => {
    setNewFile(undefined);
    form.setValue('file', undefined);
  };

  const removeExistingFile = () => {
    setExistingFileRemoved(true);
    if (newFile) {
      setNewFile(undefined);
      form.setValue('file', undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isEditing && !isLoading) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNewFile(undefined);
    setExistingFileRemoved(false);
  };
  console.log(content , fileUrl)
  return (
    <div className="relative group flex items-start hover:bg-black/5 p-4 transition w-full">
      <div className="flex gap-x-3 items-start w-full">
        <div onClick={onMemberClicked} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profileImageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClicked} className="text-sm font-semibold hover:underline cursor-pointer">{member.profileName}</p>
              <ActionTooltip label={MemberRole[member.role]}>
                {roleIconsMap[MemberRole[member.role] as keyof typeof roleIconsMap]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
          </div>

          {!isEditing ? (
            <div
              className={cn(
                'mt-1 text-sm break-words',
                deleted ? 'italic text-zinc-500 text-xs line-through' : 'text-zinc-600 dark:text-zinc-300'
              )}
            >
              {deleted ? '(deleted message)' : content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-zinc-500 dark:text-zinc-400 text-[10px]">(edited)</span>
              )}
            </div>
          ) : (
            <Form {...form}>
              <form className="mt-1 flex flex-col gap-y-2" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center gap-x-2">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="p-2 bg-zinc-100 dark:bg-zinc-700/50 border border-zinc-300 dark:border-zinc-600 rounded-md focus-visible:ring-1 focus-visible:ring-indigo-500 text-zinc-600 dark:text-zinc-200 text-sm"
                              placeholder="Edit your message"
                              {...field}
                              onKeyDown={handleKeyDown}
                              disabled={isLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                              onClick={cancelEdit}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="text-indigo-600 dark:text-indigo-400 border-indigo-500 hover:bg-indigo-500 hover:text-white transition flex items-center gap-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {fileUrl && !existingFileRemoved && !newFile && (
                    <MessageFilePreview fileUrl={fileUrl} onRemove={removeExistingFile} />
                  )}
                  {newFile && <MessageFilePreview file={newFile} onRemove={removeNewFile} />}
                  {!newFile && (
                    <label className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      {fileUrl && !existingFileRemoved ? 'Replace File' : 'Add File'}
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,application/pdf"
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              </form>
            </Form>
          )}

          {fileUrl && !isEditing && !deleted && (
            <div
              className="relative flex items-center gap-3 mt-2 p-3 border rounded-md w-fit bg-secondary cursor-pointer hover:shadow-lg hover:bg-opacity-80 transition-all duration-200"
              onClick={handleDownload}
            >
              {fileType === 'image' ? (
                <img
                  src={fileUrl}
                  alt="attachment"
                  className="object-cover w-16 h-16 rounded-md border-2 border-gray-200 shadow-md"
                />
              ) : fileType === 'pdf' ? (
                <FileText className="w-10 h-10 text-red-500" />
              ) : (
                <File className="w-10 h-10 text-gray-500" />
              )}
              <div className="flex flex-col text-sm">
                <span className="font-semibold truncate max-w-[180px]">{fileUrl.split('/').pop()}</span>
                <span className="text-xs text-zinc-500 truncate max-w-[180px]">
                  {fileUrl.split('/').pop()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 rounded-sm border shadow-sm">
          {canEditMessage && !isEditing && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              />
            </ActionTooltip>
          )}
          {canDeleteMessage && (
            <ActionTooltip label="Delete">
              <Trash
                onClick={() => {
                  onOpen('deleteMessage', { messageId: id, query, messageType });
                }}
                className="cursor-pointer w-4 h-4 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
              />
            </ActionTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatItem;