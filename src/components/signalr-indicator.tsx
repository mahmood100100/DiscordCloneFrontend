"use client";
import React from "react";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

const SignalrIndicator = () => {
  const isConnected = useSelector((state: RootState) => state.server.signalrConnected);

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "bg-yellow-600 text-white border-none",
          "text-xs sm:text-sm"
        )}
      >
        Fallback: polling every 1s
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "bg-emerald-600 text-white border-none",
        "text-xs sm:text-sm"
      )}
    >
      Live: Real-Time
    </Badge>
  );
};

export default SignalrIndicator;