"use client";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { channelCreationSchema } from "@/schema/channel";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
  createChannelApiCall,
  deleteChannelApiCall,
  updateChannelApiCall,
} from "@/lib/channel";
import { addServerChannel, removeServerChannel, updateServerChannel } from "@/redux/slices/server-slice";
import { useModal } from "@/hooks/use-modal-store";
import { Channel, ChannelType } from "@/types/channel";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Trash, Pencil } from "lucide-react";
import { MemberRole } from "@/types/member";
import { RootState } from "@/redux/store";

const ChannelsModal = () => {
  const profile = useSelector((state: RootState) => state.auth.user?.profile);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { isOpen, onClose, type, data} = useModal();
  const { server , channelType } = data;
  const serverId = server?.id;
  const reduxServer = useSelector((state: RootState) =>
    state.server.servers.find((server) => server.id === serverId)
  );
  const profileMember = reduxServer?.members.find(
    (member) => member.profileId === profile?.id
  );
  const isModalOpen = isOpen && type === "channels";
  const [loadingId, setLoadingId] = React.useState("");
  const [renameModalOpen, setRenameModalOpen] = React.useState(false);
  const [channelToRename, setChannelToRename] = React.useState<Channel | null>(null);

  const channelForm = useForm({
    resolver: zodResolver(channelCreationSchema),
    defaultValues: {
      name: "",
      type: channelType || 0 as ChannelType,
    },
  });

  const isLoading = channelForm.formState.isSubmitting;

  const isChannelNameUnique = (name: string, channelId?: string) => {
    return !reduxServer?.channels.some(
      (channel) => channel.name.toLowerCase() === name.toLowerCase() && channel.id !== channelId
    );
  };

  const onSubmit = async (values: z.infer<typeof channelCreationSchema>) => {
    try {
      if (!profile?.id) {
        toast.error("Profile ID not found. Please try again.");
        return;
      }

      if (!isChannelNameUnique(values.name)) {
        toast.error("A channel with this name already exists.");
        return;
      }

      const response = await createChannelApiCall(
        profile?.id,
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
      } else {
        toast.error(response.error || "Channel creation failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again later.");
    }
  };

  const handleDeleteChannel = async (
    requesterProfileId: string,
    channelId: string,
    serverId: string
  ) => {
    try {
      setLoadingId(channelId);

      if (
        MemberRole[profileMember?.role ?? 2] !== "ADMIN" &&
        requesterProfileId !== profile?.id
      ) {
        toast.error("You can only delete channels you created.");
        return;
      }

      const response = await deleteChannelApiCall(requesterProfileId, channelId, serverId);

      if (response.success) {
        dispatch(removeServerChannel({ serverId: server?.id || "", channelId }));
        toast.success(response.message || "Channel deleted successfully!");
        const isViewingDeletedChannel = params?.channelId === channelId;
        if (isViewingDeletedChannel) {
          router.replace(`/servers/${serverId}`);
        } else {
          router.refresh();
        }

      } else {
        toast.error(response.error || "Failed to delete channel.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while deleting the channel.");
    } finally {
      setLoadingId("");
    }
  };

  const handleUpdateChannelName = async (channelId: string, newName: string) => {
    try {
      setLoadingId(channelId);

      if (!isChannelNameUnique(newName, channelId)) {
        toast.error("A channel with this name already exists.");
        return;
      }

      const response = await updateChannelApiCall(
        profile?.id || "",
        channelId,
        newName,
        serverId || ""
      );

      if (response.success) {
        const updatedChannel: Channel = response.result;
        dispatch(
          updateServerChannel({ serverId: server?.id || "", channel: updatedChannel })
        );
        toast.success(response.message || "Channel name updated successfully!");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update channel name.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while updating the channel name.");
    } finally {
      setLoadingId("");
      setRenameModalOpen(false);
      setChannelToRename(null);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden max-w-lg mx-auto">

        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-semibold">Manage Channels</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {reduxServer?.channels.length} Channels
          </DialogDescription>
        </DialogHeader>

        <div className="px-2 mt-4 max-h-[170px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-white rounded-md border border-zinc-200">
          {reduxServer?.channels.map((channel: Channel) => {
            const isCreator = channel.profileId === profile?.id;
            const isGeneralChannel = channel.name.toLowerCase() === "general";

            return (
              <div
                key={channel.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-100 transition-colors"
              >

                <div className="flex flex-col gap-y-1">
                  <div className="text-sm font-semibold flex items-center">
                    {channel.name}
                    <span className="ml-2 text-xs text-zinc-500">
                      ({channel.type === 0 ? "Text" : channel.type === 1 ? "Voice" : "Video"})
                    </span>
                  </div>
                </div>

                {!isGeneralChannel &&
                  (isCreator || MemberRole[profileMember?.role ?? 2] === "ADMIN") &&
                  loadingId !== channel.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500 cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" className="w-48">

                        <DropdownMenuItem
                          onClick={() => {
                            setChannelToRename(channel);
                            setRenameModalOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-600 focus:text-blue-600"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Channel
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteChannel(profile?.id || "", channel.id, serverId || "")
                          }
                          className="text-red-500 hover:text-red-600 focus:text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Channel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                {loadingId === channel.id && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                )}
              </div>
            );
          })}
        </div>

        <Dialog open={renameModalOpen} onOpenChange={setRenameModalOpen}>
          <DialogContent className="bg-white text-black overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl text-center font-semibold">Edit Channel</DialogTitle>
            </DialogHeader>
            <Form {...channelForm}>
              <form
                onSubmit={channelForm.handleSubmit((values) => {
                  if (channelToRename) {
                    handleUpdateChannelName(channelToRename.id, values.name);
                  }
                })}
                className="space-y-4"
              >
                <FormField
                  control={channelForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Channel Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new channel name"
                          {...field}
                          disabled={isLoading}
                          className="border border-zinc-300 bg-zinc-100 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 text-black w-full p-2 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                  variant="primery"
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-500 hover:bg-indigo-400 transition-colors"
                  >
                    {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Create New Channel Section */}
        <div className="px-6 pb-6 pt-4 border-t border-zinc-200">
          <h3 className="text-xl font-semibold text-center mb-6">Create a New Channel</h3>
          <Form {...channelForm}>
            <form onSubmit={channelForm.handleSubmit(onSubmit)} className="space-y-4">
              {/* Channel Name Field */}
              <FormField
                control={channelForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter channel name"
                        {...field}
                        disabled={isLoading}
                        className="border border-zinc-300 bg-zinc-100 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 text-black w-full p-2 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Channel Type Field */}
              <FormField
                control={channelForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) as ChannelType)}
                        disabled={isLoading}
                        className="border border-zinc-300 bg-zinc-100 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 text-black w-full p-2 rounded-md"
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

              {/* Submit Button */}
              <DialogFooter>
                <Button
                variant="primery"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 transition-colors"
                >
                  {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Create Channel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelsModal;