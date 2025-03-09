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
import { z } from "zod";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { forgetPasswordSchema } from "@/schema/auth";
import { forgetPasswordApiCall } from "@/lib/auth";
import { useDispatch } from "react-redux";
import BackButton from "../layouts/back-button";
import { forgetPasswordRequestFailure, forgetPasswordRequestSuccess } from "@/redux/slices/auth-slice";

type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;

const ForgetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<ForgetPasswordFormValues>({
    resolver: zodResolver(forgetPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgetPasswordFormValues) => {
    console.log("Form submitted:", data);
    setLoading(true);

    try {
      console.log("Sending forget password request...");
      const result = await forgetPasswordApiCall(data.email);

      if (result.success) {
        const { resetPasswordToken } = result;

        console.log("reset pass token", resetPasswordToken);
        dispatch(forgetPasswordRequestSuccess({ resetPasswordToken }));

        localStorage.setItem("resetPasswordEmail", data.email);

        toast.success("Request sent successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        });

        router.replace("/reset-password");
      } else {
        console.error("Request failed:", result.error);
        dispatch(forgetPasswordRequestFailure(result.error));

        toast.error(result.error, {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      label="No Problem"
      title="Forget Password"
      backButtonHref="/login"
      backButtonLabel="Back to login page"
      cardClassName="bg-gray-800 text-white"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="something@gmail.com"
                      disabled={loading}
                      className="bg-gray-700 text-white focus:ring-[#5865F2] border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <BackButton
              href="/login"
              label="Back to login page"
              className="justify-start text-[#f2f3f5] dark:text-gray-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 px-4 rounded transition duration-300"
            disabled={loading}
          >
            {loading ? "Requesting..." : "Request"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgetPasswordForm;
