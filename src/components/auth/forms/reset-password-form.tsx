"use client";
import CardWrapper from "../layouts/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schema/auth";
import { Input } from "../../ui/input";
import { z } from "zod";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { resetPasswordApiCall, forgetPasswordApiCall } from "@/lib/auth";
import SplashScreen from "@/components/splash-screen";

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [sendingToken, setSendingToken] = useState(false); 
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      token: "",
      newPassword: "",
      confirmedNewPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);

    try {
      const email: string | null = localStorage.getItem("resetPasswordEmail");
      console.log(email);

      if (email == null) {
        toast.error("Email not found in session. Please try again.", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      } else {
        const result = await resetPasswordApiCall(data.token, data.newPassword, data.confirmedNewPassword, email);

        if (!result) {
          toast.success("Password reset successfully", {
            position: "top-right",
            duration: 3000,
            style: {
              background: "#4caf50",
              color: "#fff",
            },
          });
          localStorage.removeItem("resetPasswordEmail");

          router.replace("/login");
        } else {
          throw new Error(result?.error || "Reset password failed.");
        }
      }
    } catch (error) {
      console.error("API Errors:", error);

      toast.error(
        error instanceof Error ? error.message : "Reset password failed. Please check your inputs.",
        {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#f44336",
            color: "#fff",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const resendToken = async () => {
    setSendingToken(true);

    try {
      const email: string | null = localStorage.getItem("resetPasswordEmail");
      if (email == null) {
        toast.error("No email found. Please request a reset token again.", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
        return;
      }

      const result = await forgetPasswordApiCall(email);
      if (result.success) {
        toast.success("A new reset token has been sent to your email.", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        });
      } else {
        toast.error(result.error || "Failed to send new token.", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to resend reset token. Please try again.", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    } finally {
      setSendingToken(false);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("resetPasswordEmail");
    if (!email) {
      router.replace("/forget-password");
    }
  }, [router]);

  if (!localStorage.getItem("resetPasswordEmail")) {
    return <SplashScreen />;
  }

  return (
    <CardWrapper
      label="remember it"
      title="Reset Password"
      backButtonHref="/login"
      backButtonLabel="Already have an account? Login here?"
      cardClassName="xl:w-2/5 md:w-3/5 sm:w-4/5"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="token" render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="text" 
                  placeholder="@dokfosdkfsIJRIeoQij" 
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="newPassword" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="******" 
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="confirmedNewPassword" render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password" 
                  placeholder="******" 
                  className="dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="col-span-full mt-12">
            <Button 
              type="submit" 
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 px-4 rounded transition duration-300"
              disabled={loading}
            >
              {loading ? "Reseting..." : "Reset"}
            </Button>
          </div>

          <div className="col-span-full mt-4">
            <Button 
              type="button" 
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 px-4 rounded transition duration-300" 
              onClick={resendToken} 
              disabled={sendingToken}
            >
              {sendingToken ? "Sending..." : "Resend Token"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
