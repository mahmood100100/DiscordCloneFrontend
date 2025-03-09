"use client";

import React, { useState } from "react";
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
import { changePasswordApiCall } from "@/lib/auth";
import { changePasswordSchema } from "@/schema/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const UserPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user!);

  const passwordForm = useForm<ChangePasswordFormValues>({
    mode: "onBlur",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmedNewPassword: "",
    },
  });

  const onChangePassword = async (data: ChangePasswordFormValues) => {
    setLoading(true);
    try {
      const response = await changePasswordApiCall({
        id: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.success) {
        toast.success(response.message);
        passwordForm.reset();
      } else {
        toast.error(response.error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error changing password", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="dark:bg-[#25282B] bg-zinc-100 py-8 px-6 rounded-lg border dark:border-white border-[#313338] w-full max-w-xl">
        <h2 className="text-2xl text-center font-semibold text-zinc-700 dark:text-zinc-200 mb-6">
          Change Your Password
        </h2>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Current Password"
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
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="New Password"
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
              control={passwordForm.control}
              name="confirmedNewPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm New Password"
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
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserPasswordPage;