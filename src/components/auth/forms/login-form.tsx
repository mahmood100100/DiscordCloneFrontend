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
import { LoginSchema } from "@/schema/auth";
import { loginSuccess, loginFailure } from "@/redux/slices/auth-slice";
import { loginApiCall, sendVerificationEmailApiCall } from "@/lib/auth";
import { useDispatch } from "react-redux";
import BackButton from "../layouts/back-button";

type LoginFormValues = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const result = await loginApiCall(data.email, data.password);

      if (result.success) {
        const { accessToken, user, expiresIn } = result;
        dispatch(loginSuccess({ accessToken, user, expiresIn }));
        toast.success("Login successful!");
        router.replace("/");
      } else {
        dispatch(loginFailure(result.error));
        toast.error(result.error);
        const errorMessage = result.error.toLowerCase();
        if (errorMessage.includes("verify") || errorMessage.includes("confirmed")) {
          setEmailVerified(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const email = form.getValues("email");

    const result = await form.trigger("email");
    if (!result) return;

    setResendLoading(true);
    try {
      const response = await sendVerificationEmailApiCall(email);
      if (response.success) {
        toast.success("Verification email has been resent!");
        setEmailVerified(true);
      } else {
        toast.error(response.error || "Failed to resend verification email.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <CardWrapper
      label="Welcome Back"
      title="Login"
      backButtonHref="/register"
      backButtonLabel="Don't have an account? Register here"
      cardClassName="bg-gray-800 text-white"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-4 bg-gray-800  rounded-lg shadow-md"
        >
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
                    className="bg-gray-700 text-white focus:ring-[#5865F2] border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="******"
                    className="bg-gray-700 text-white focus:ring-[#5865F2] border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <BackButton
            href="/forget-password"
            label="Forgot your password?"
            className="justify-start h-0 text-[#f2f3f5] dark:text-gray-300 transition duration-300"
          />

          <div className="col-span-full">
            <Button
              type="submit"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 px-4 rounded transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>

          {!emailVerified && (
            <div className="mt-4">
              <Button
                type="button"
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                {resendLoading ? "Resending..." : "Resend Verification Email"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
