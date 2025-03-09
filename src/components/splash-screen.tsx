"use client";

import React from "react";
import Image from "next/image";
import DiscordLogoWhite from "@/images/Discord-Symbol-White.png";

const SplashScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-zinc-600/20 blur-xl animate-pulse-slow" />
          <Image
            src={DiscordLogoWhite}
            alt="Discord Logo"
            width={96}
            height={96}
            className="relative z-10 animate-bounce-slow drop-shadow-lg"
            priority
          />
        </div>

        <div className="text-4xl font-extrabold text-zinc-100 tracking-widest animate-fade-in">
          My Discord
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;