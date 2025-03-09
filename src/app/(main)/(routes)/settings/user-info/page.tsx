"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUserApiCall } from "@/lib/auth";
import { UpdateUserSchema } from "@/schema/auth";
import { updateUserRequestFailure, updateUserRequestSuccess } from "@/redux/slices/auth-slice";
import { RootState } from "@/redux/store";
import { User } from "@/types/auth";
import FileUpload from "@/components/file-upload";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { z } from "zod";

const UserInfoPage = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const user: User = useSelector((state: RootState) => state.auth.user!);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    mode: "onBlur",
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.profile.name || "",
      userName: user.userName || "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (user.profile.imageUrl) {
      setImagePreview(user.profile.imageUrl);
    }
  }, [user.profile.imageUrl]);

  const onSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("name", data.name);
      formData.append("userName", data.userName);

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await updateUserApiCall(formData);

      if (response.success) {
        toast.success("User info updated successfully!");
        dispatch(updateUserRequestSuccess(response.result));
      } else {
        toast.error(response.error);
        dispatch(updateUserRequestFailure(response.error));
      }
    } catch (error) {
      console.error("Error updating user info", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file?: File) => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      form.setValue("image", file, { shouldValidate: true });
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue("image", undefined);
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="dark:bg-[#25282B] bg-zinc-100 py-8 px-6 rounded-lg border dark:border-white border-[#313338] w-full max-w-xl">
        <h2 className="text-2xl text-center font-semibold text-zinc-700 dark:text-zinc-200 mb-6">
          Change Your Information
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center mb-8">
                  <FormControl>
                    {imagePreview ? (
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded-full border-4 border-zinc-400 dark:border-zinc-600 shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 right-3 bg-red-600 rounded-full p-1.5 shadow-md hover:bg-red-700 transition-colors duration-200"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 flex items-center justify-center">
                        <FileUpload
                          onChange={handleImageChange}
                          value={field.value}
                        />
                      </div>
                    )}
                  </FormControl>
                  <FormMessage className="mt-2 text-center" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Your Name"
                      className={cn(
                        "bg-zinc-200 dark:bg-[#2B2D31] text-zinc-800 dark:text-zinc-200",
                        "border-zinc-300 dark:border-zinc-600",
                        "focus:border-zinc-500 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500/50 dark:focus:ring-zinc-400/50",
                        "rounded-lg transition-all duration-200 placeholder-zinc-500 dark:placeholder-zinc-400"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Choose a username"
                      className={cn(
                        "bg-zinc-200 dark:bg-[#2B2D31] text-zinc-800 dark:text-zinc-200",
                        "border-zinc-300 dark:border-zinc-600",
                        "focus:border-zinc-500 dark:focus:border-zinc-400 focus:ring-2 focus:ring-zinc-500/50 dark:focus:ring-zinc-400/50",
                        "rounded-lg transition-all duration-200 placeholder-zinc-500 dark:placeholder-zinc-400"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="primery"
              className={cn(
                "w-full font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200",
                loading && "opacity-50 cursor-not-allowed"
              )}
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserInfoPage;