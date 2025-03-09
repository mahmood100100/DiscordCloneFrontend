"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { updateServerSchema } from "@/schema/server";
import FileUpload from "@/components/file-upload";
import { X } from "lucide-react";
import { updateServerApiCall } from "@/lib/server";
import { useDispatch, useSelector } from "react-redux";
import { updateServerSuccess } from "@/redux/slices/server-slice";
import { useModal } from "@/hooks/use-modal-store";
import { Server } from "@/types/server";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RootState } from "@/redux/store";

const EditServerModal = () => {
  const { isOpen, onClose, data } = useModal();
  const server: Server | undefined = data.server;
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(server?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const dispatch = useDispatch();
  const profile = useSelector((state : RootState) => state.auth.user?.profile!);

  const form = useForm({
    resolver: zodResolver(updateServerSchema),
    defaultValues: {
      name: server?.name || "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (server?.imageUrl) {
      setImagePreview(server.imageUrl);
    }
    if (server?.name) {
      form.setValue("name", server.name);
    }
  }, [server, form]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("profileId", profile.id);

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        const result = await updateServerApiCall(server?.id || "", formData);

        if (result.success) {
            toast.success("Server updated successfully!");
            dispatch(updateServerSuccess(result.server));
            onClose();
        } else {
            toast.error(result.error);
        }
    } catch (error) {
        toast.error("An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
};


  const handleImageChange = (file?: File) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setSelectedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Update your server's name and image to keep it fresh. You can always modify these settings later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 px-6">
            <div className="flex items-center justify-center text-center">
              {!imagePreview && (
                <FileUpload onChange={handleImageChange} value={selectedFile} />
              )}
              {imagePreview && (
                <div className="mt-2 relative">
                  <img
                    src={imagePreview}
                    alt="Server preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-white rounded-full p-1"
                  >
                    <X className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Server Name
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

export default EditServerModal;
