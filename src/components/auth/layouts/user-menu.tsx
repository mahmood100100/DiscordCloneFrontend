// components/ui/user-menu.tsx
"use client";

import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/auth-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logoutApiCall } from "@/lib/auth";

const UserMenu = ({ image }: { image: string }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logoutApiCall();
      console.log(result);
  
      // If result is undefined, the logout was successful
      if (result === undefined) {
        dispatch(logout());
        toast.success("Logged out successfully", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        });
        router.replace("/login");
      } else if (result?.success === false) {
        // If result contains success: false, handle failure
        toast.error(result?.error || "Logout failed. Please try again.", {
          position: "top-right",
          duration: 3000,
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout. Please try again.", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    }
  };
  

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="group relative bg-transparent border-0">
          <span className="sr-only">User Menu</span>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {/* Render the user image */}
            <img src={image} alt="User Avatar" className="object-cover w-full h-full" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
