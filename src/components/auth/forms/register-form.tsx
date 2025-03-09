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
import { RegisterSchema } from "@/schema/auth";
import { Input } from "../../ui/input";
import { z } from "zod";
import { Button } from "../../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { registerApiCall } from "@/lib/auth";
import { useRouter } from "next/navigation";
import ImageUploadField from "../layouts/file-upload";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      userName: "",
      password: "",
      confirmPassword: "",
      image: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);

    try {
      console.log("Form Data:", data);

      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("userName", data.userName);
      formData.append("password", data.password);
      if (data.image) {
        formData.append("image", data.image);
      }

      const result = await registerApiCall(formData);

      if (result.success) {
        console.log(result.data);

        toast.success("Registration successful!", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        });

        router.push("/login");
      } else {
        console.error("API Errors:", result.error);

        form.clearErrors();

        if (Array.isArray(result.error)) {
          result.error.forEach((errorMsg) => {
            if (errorMsg.toLowerCase().includes("email")) {
              form.setError("email", { type: "manual", message: errorMsg });
            }
            if (errorMsg.toLowerCase().includes("username")) {
              form.setError("userName", { type: "manual", message: errorMsg });
            }
          });
        }

        toast.error("Registration failed. Please check your inputs.", {
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
      label="Create an account"
      title="Register"
      backButtonHref="/login"
      backButtonLabel="Already have an account? Login here?"
      cardClassName="xl:w-2/5 md:w-3/5 sm:w-4/5 bg-gray-800 text-white"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-md"
          encType="multipart/form-data"
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

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Your Name"
                    className="bg-gray-700 text-white focus:ring-[#5865F2] border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UserName Field */}
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Choose a username"
                    className="bg-gray-700 text-white focus:ring-[#5865F2] border-gray-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
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

          {/* Image Upload Field */}
          <ImageUploadField form={form} />

          {/* Submit Button */}
          <div className="col-span-full">
            <Button type="submit" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2 px-4 rounded transition duration-300" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
