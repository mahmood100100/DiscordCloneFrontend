"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import {
  createConversationFailure,
  createConversationStart,
  createConversationSuccess,
  setActiveConversation,
} from "@/redux/slices/conversation-slice";
import { getOrCreateConversationApiCall } from "@/lib/conversation";
import ChatHeader from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";
import { use } from "react";
import { Loader2 } from "lucide-react";

interface MemberIdPageProps {
  params: Promise<{ memberId: string; serverId: string }>;
  searchParams: Promise<{ video: boolean }>;
}

const MemberIdPage = ({ params, searchParams }: MemberIdPageProps) => {
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(true);
  const memberId = resolvedParams.memberId;
  const serverId = resolvedParams.serverId;
  const resolvedSearchParams = use(searchParams);
  const video = resolvedSearchParams.video;

  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.auth.user?.profile);

  const currentMember = useSelector((state: RootState) =>
    state.server.servers
      .find((server) => server.id === serverId)
      ?.members.find((member) => member.profileId === profile?.id)
  );

  if (!currentMember) {
    redirect("/");
  }

  const conversation = useSelector((state: RootState) =>
    state.conversation.conversations.find(
      (conv) =>
        (conv.memberOneId === currentMember?.id && conv.memberTwoId === memberId) ||
        (conv.memberOneId === memberId && conv.memberTwoId === currentMember?.id)
    )
  );

  const otherMember = useSelector((state: RootState) =>
    state.server.servers
      .find((server) => server.id === serverId)
      ?.members.find((member) =>
        member.id ===
        (conversation?.memberOneId === currentMember?.id
          ? conversation.memberTwoId
          : conversation?.memberOneId)
      )
  );

  const getOrCreateConversation = async (
    memberOneId: string,
    memberTwoId: string
  ) => {
    try {
      dispatch(createConversationStart());
      const response = await getOrCreateConversationApiCall(
        memberOneId,
        memberTwoId,
        15
      );
      if (response.success) {
        console.log(response.result)
        dispatch(createConversationSuccess(response.result));
        dispatch(setActiveConversation(response.result.id));
      } else {
        dispatch(createConversationFailure(response.error));
        toast.error(response.error);
        redirect("/");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while fetching or creating the conversation";
      dispatch(createConversationFailure(errorMessage));
      toast.error(errorMessage);
      redirect("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentMember) {
      redirect("/");
    }
    if (conversation) {
      dispatch(setActiveConversation(conversation.id));
      setLoading(false);
    } else if (currentMember) {
      getOrCreateConversation(currentMember.id, memberId);
    }
  }, [conversation, currentMember, memberId, dispatch]);


  if (!profile) {
    redirect("/login");
  }

  if (loading || !conversation || !otherMember) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-zinc-500" />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {loading ? "Loading conversation..." : "Preparing conversation..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember?.profileImageUrl}
        name={otherMember?.profileName || ""}
        serverId={serverId}
        type="conversation"
      />
      {video && (
        <MediaRoom chatId={conversation?.id || ""} video={true} audio={true} />
      )}
      {!video && (
        <>
          <ChatMessages
            name={otherMember?.profileName || ""}
            member={currentMember}
            chatId={conversation?.id || ""}
            query={{ conversationId: conversation?.id, serverId: serverId }}
            paramKey={"conversationId"}
            paramValue={memberId}
            type="conversation"
          />
          <ChatInput
            name={otherMember?.profileName || ""}
            type="conversation"
            query={{
              conversationId: conversation?.id,
              senderMemberId: currentMember?.id,
              receiverMemberId: otherMember?.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;