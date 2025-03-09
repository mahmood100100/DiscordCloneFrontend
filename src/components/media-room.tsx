"use client";
import { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const [token, setToken] = useState<string>("");
  const profile = useSelector((state: RootState) => state.auth.user?.profile);

  useEffect(() => {
    if (!profile) return;
    const name = profile?.name;

    (async () => {
      try {
        const response = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await response.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [profile?.name, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      className="w-full h-full"
    >
      <VideoConference/>
    </LiveKitRoom>
  );
};
