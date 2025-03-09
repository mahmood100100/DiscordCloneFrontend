"use client";
import { format } from "date-fns";
import { Member } from "@/types/member";
import { Message } from "@/types/message";
import { DirectMessage } from "@/types/direct-message";
import { MessageApiResponse, DmApiResponse } from "@/types/api";
import ChatWelcome from "./chat-welcome";
import { Fragment, useEffect, useRef, useState } from "react";
import { ServerCrash, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { dmSignalRService, messageSignalRService } from "@/lib/signalr-service";
import ChatItem from "./chat-item";
import { getMessagesByChannelIdApiCall } from "@/lib/message";
import { getDirectMessagesByConversationIdApiCall } from "@/lib/direct-message";
import { updateChannelMessages } from "@/redux/slices/server-slice";
import { updateConversationMessages } from "@/redux/slices/conversation-slice";

const DATE_FORMAT = "d MMM yyyy HH:mm:ss";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  query: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages = ({ name, member, chatId, query, paramKey, paramValue, type }: ChatMessagesProps) => {
  const dispatch = useDispatch();
  const server = useSelector((state: RootState) =>
    state.server.servers.find((server) => server.id === query.serverId)
  );
  const channel = useSelector((state: RootState) =>
    type === "channel"
      ? state.server.servers.find((server) => server.id === query.serverId)?.channels.find((ch) => ch.id === chatId)
      : null
  );
  const conversation = useSelector((state: RootState) =>
    type === "conversation"
      ? state.conversation.conversations.find((conv) => conv.id === chatId)
      : null
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(2);

  const getMember = (message: Message | DirectMessage): Member | undefined => {
    if (type === "channel" && "memberId" in message) {
      const foundMember = server?.members.find((m) => m.id === message.memberId);
      return foundMember;
    }
    if (type === "conversation" && "senderMemberId" in message) {
      const foundMember = server?.members.find((m) => m.id === message.senderMemberId);
      return foundMember;
    }
    return undefined;
  };

  const fetchPreviousMessages = async () => {
    if (!hasMoreMessages) return;

    try {
      setIsLoadingPrevious(true);
      const apiCall =
        type === "channel"
          ? getMessagesByChannelIdApiCall(paramValue, page, 15)
          : getDirectMessagesByConversationIdApiCall(paramValue, page, 15);

      const response = await apiCall;

      if (!response.success) {
        setHasMoreMessages(false);
        return;
      }

      const newMessages: (Message | DirectMessage)[] = (
        type === "channel"
          ? (response as MessageApiResponse & { success: true }).result.messages
          : (response as DmApiResponse & { success: true }).result.directMessages
      ).filter((msg): msg is Message | DirectMessage => msg !== null && msg !== undefined);

      console.log("Fetched messages:", newMessages);

      const totalCount = response.result.totalCount;

      if (newMessages.length === 0 || newMessages.length < 15) {
        setHasMoreMessages(false);
      }

      if (type === "channel" && server && channel) {
        const updatedMessages = [...newMessages, ...(channel.messages || [])];
        dispatch(
          updateChannelMessages({
            serverId: server.id,
            channelId: channel.id,
            messages: updatedMessages as Message[],
          })
        );
      } else if (type === "conversation" && conversation) {
        dispatch(
          updateConversationMessages({
            conversationId: paramValue,
            directMessages: newMessages as DirectMessage[],
          })
        );
      }

      setPage((prev) => prev + 1);

      const container = messagesContainerRef.current;
      if (container) {
        const previousHeight = container.scrollHeight;
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight - previousHeight;
        });
      }
    } catch (error) {
      setHasMoreMessages(false);
    } finally {
      setIsLoadingPrevious(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const manageSignalRGroups = async () => {
      if (!isMounted) return;
      if (type === "channel" && (!channel || !server)) return;
      if (type === "conversation" && (!conversation || !server)) return;

      try {
        if (!messageSignalRService.isConnected()) {
          while (!messageSignalRService.isConnected() && isMounted) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        if (!dmSignalRService.isConnected()) {
          while (!dmSignalRService.isConnected() && isMounted) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        if (type === "channel" && server && channel) {
          await messageSignalRService.joinMessageGroup(server.id, channel.id);
        } else if (type === "conversation" && conversation) {
          await dmSignalRService.joinDMGroup(conversation.id);
        }
      } catch (error) {
        console.error("Error managing SignalR groups:", error);
      }
    };

    manageSignalRGroups();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        try {
          if (type === "channel" && channel && server && messageSignalRService.isConnected()) {
            await messageSignalRService.leaveMessageGroup(server.id, channel.id);
          }
          if (type === "conversation" && conversation && dmSignalRService.isConnected()) {
            await dmSignalRService.leaveDMGroup(conversation.id);
          }
        } catch (error) {
          console.error("Error during SignalR cleanup:", error);
        }
      };
      cleanup();
    };
  }, [type, server?.id, channel?.id, conversation?.id]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && !isLoadingPrevious) {
      container.scrollTop = container.scrollHeight;
    }
  }, [
    type === "channel" ? channel?.messages?.length : conversation?.directMessages?.length,
    isLoadingPrevious,
  ]);

  const messages: (Message | DirectMessage)[] = (
    type === "channel" ? channel?.messages || [] : conversation?.directMessages || []
  ).filter((msg): msg is Message | DirectMessage => msg !== null && msg !== undefined);

  const isMessageUpdated = (message: Message | DirectMessage): boolean => {
    const createdAt = new Date(message.createdAt).getTime();
    const updatedAt = new Date(message.updatedAt).getTime();
    return updatedAt > createdAt;
  };

  if ((type === "channel" && !channel) || (type === "conversation" && !conversation)) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {type === "channel" ? "Channel not found!" : "Conversation not found!"}
        </p>
      </div>
    );
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 flex flex-col py-4 overflow-y-auto hide-scrollbar">
      {messages.length >= 15 && hasMoreMessages && (
        <div className="flex justify-center py-4">
          <button
            onClick={fetchPreviousMessages}
            disabled={isLoadingPrevious}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 text-xs my-4 transition flex items-center gap-2"
          >
            {isLoadingPrevious ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load Previous Messages"
            )}
          </button>
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
        {messages.length > 0 ? (
          messages.map((message, i) => (
            <Fragment key={message.id || i}>
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                currentMember={member}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={isMessageUpdated(message)}
                query={query}
                member={getMember(message) || member}
                messageType={type}
              />
            </Fragment>
          ))
        ) : null}

        {(messages.length < 15 || !hasMoreMessages) && <ChatWelcome type={type} name={name} />}
      </div>
    </div>
  );
};

export default ChatMessages;