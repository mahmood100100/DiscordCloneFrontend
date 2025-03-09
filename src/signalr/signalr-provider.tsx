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
          memberSignalRService.startConnection("https://localhost:7023/memberHub"),
          channelSignalRService.startConnection("https://localhost:7023/channelHub"),
          serverSignalRService.startConnection("https://localhost:7023/serverHub"),
          messageSignalRService.startConnection("https://localhost:7023/messageHub"),
          dmSignalRService.startConnection("https://localhost:7023/directMessageHub"),
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