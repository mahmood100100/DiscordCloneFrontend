"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { memberSignalRService, channelSignalRService, serverSignalRService, messageSignalRService, dmSignalRService } from "@/lib/signalr-service";
import { setSignalrStatus } from "@/redux/slices/server-slice";
import { RootState } from "@/redux/store";
import { useMemberNotifications } from "./member-notifications";
import { useChannelNotifications } from "./channel-notifications";
import { useServerNotifications } from "./server-notifications";
import { useMessageNotifications } from "./message-notifications";
import { useDMNotifications } from "./direct-message-notifications";

// SignalR Hub URLs from environment variables
const SIGNALR_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_SIGNALR_URL || "https://discordclonebackend.onrender.com";
const MEMBER_HUB_URL = `${SIGNALR_BASE_URL}/memberHub`;
const CHANNEL_HUB_URL = `${SIGNALR_BASE_URL}/channelHub`;
const SERVER_HUB_URL = `${SIGNALR_BASE_URL}/serverHub`;
const MESSAGE_HUB_URL = `${SIGNALR_BASE_URL}/messageHub`;
const DM_HUB_URL = `${SIGNALR_BASE_URL}/directMessageHub`;

export default function SignalRProvider() {
  const dispatch = useDispatch();
  const servers = useSelector((state: RootState) => state.server.servers);
  const serverIds = servers.map((server) => server.id);
  const userId = useSelector((state: RootState) => state.auth.user?.profile?.id) || "";
  const activeConversationId = useSelector((state: RootState) => state.conversation.activeConversationId);

  const memberNotifications = useMemberNotifications();
  const channelNotifications = useChannelNotifications();
  const serverNotifications = useServerNotifications();
  const messageNotifications = useMessageNotifications();
  const dmNotifications = useDMNotifications();

  useEffect(() => {
    if (!serverIds || serverIds.length === 0) return;

    const startConnections = async () => {
      try {
        const connectionPromises = [
          memberSignalRService.startConnection(MEMBER_HUB_URL),
          channelSignalRService.startConnection(CHANNEL_HUB_URL),
          serverSignalRService.startConnection(SERVER_HUB_URL),
          messageSignalRService.startConnection(MESSAGE_HUB_URL),
          dmSignalRService.startConnection(DM_HUB_URL),
        ];
        await Promise.all(connectionPromises);

        dispatch(setSignalrStatus(true));

        serverIds.forEach((serverId) => {
          memberSignalRService.joinMemberGroup(serverId);
          channelSignalRService.joinChannelGroup(serverId);
          serverSignalRService.joinServerGroup(serverId);
        });

        if (activeConversationId) {
          dmSignalRService.joinDMGroup(activeConversationId);
        }

        memberNotifications.setupListeners();
        channelNotifications.setupListeners();
        serverNotifications.setupListeners();
        messageNotifications.setupListeners();
        dmNotifications.setupListeners();
      } catch (error) {
        dispatch(setSignalrStatus(false));
      }
    };

    startConnections();

    return () => {
      memberNotifications.cleanup();
      channelNotifications.cleanup();
      serverNotifications.cleanup();
      messageNotifications.cleanup();
      dmNotifications.cleanup();
    };
  }, [serverIds.length, userId]);

  useEffect(() => {
    if (!activeConversationId || !dmSignalRService.isConnected()) return;

    const manageDMGroup = async () => {
      try {
        await dmSignalRService.joinDMGroup(activeConversationId);
      } catch (error) {
        console.error("Error joining DM group:", error);
      }
    };

    manageDMGroup();

    return () => {
      if (activeConversationId && dmSignalRService.isConnected()) {
        dmSignalRService.leaveDMGroup(activeConversationId)
          .catch(error => console.error("Error leaving DM group:", error));
      }
    };
  }, [activeConversationId]);

  return null;
}