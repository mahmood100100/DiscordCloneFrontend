// CreateChannelForm.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { channelCreationSchema } from "@/schema/channel";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "../ui/dialog";

const CreateChannelForm = ({ onSubmit, isLoading }: { onSubmit: any; isLoading: boolean }) => {
  const channelForm = useForm({
    resolver: zodResolver(channelCreationSchema),
    defaultValues: {
      name: "",
      type: 0,
    },
  });

  return (
    <div className="px-6 pb-6 pt-4 border-t border-zinc-200">
      <h3 className="text-xl font-semibold text-center mb-6">Create a New Channel</h3>
      <Form {...channelForm}>
        <form onSubmit={channelForm.handleSubmit(onSubmit)} className="space-y-4">
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

          <FormField
            control={channelForm.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
  );
};

export default CreateChannelForm;
