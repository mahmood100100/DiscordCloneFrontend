import api from "./api";
import { Conversation } from "@/types/conversation";

export const getOrCreateConversationApiCall = async (
  memberOneId: string,
  memberTwoId: string,
  directMessageLimit: number
): Promise<
  { success: true; message: string; result: Conversation } |
  { success: false; error: string; statusCode: number }
> => {
  try {
    const response = await api.get(`/conversations/by-members`, {
      params: { memberOneId, memberTwoId ,directMessageLimit},
    });

    return {
      success: true,
      message: response.data.message,
      result: response.data.result as Conversation,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
      statusCode: error.response?.data?.statusCode || 500,
    };
  }
};


export const deleteConversationApiCall = async (conversationId : string):
  Promise<{ success: true; message: string } | { success: false; error: string }> => {
  try {
    const response = await api.delete(`/conversations/${conversationId}`);

    return {
      success: true,
      message: response.data.message || "Conversation deleted successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred while deleting the conversation.",
    };
  }
};

export const getConversationById = async (conversationId : string): Promise<
  { success: true; message: string; result : Conversation  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.get(`/conversations/${conversationId}`);
    
    return {
      success: true,
      message: response.data.message,
      result: response.data.result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
      statusCode: error.response?.data?.statusCode
    };
  }
};
