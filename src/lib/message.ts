import { Channel } from "@/types/channel";
import api from "./api";
import { Message } from "@/types/message";
import { MessageApiResponse, UpdateMessageApiResponse } from "@/types/api";


export const createMessageApiCall = async (formData : FormData ): Promise<
  { success: true; message: string; result : Message  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.post(`/messages` , formData , {headers: {
        "Content-Type": "multipart/form-data",
      },});
    
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

export const updateMessageApiCall = async (formData : FormData):
 Promise<UpdateMessageApiResponse> => {
  try {
    const response = await api.put(`/messages` , formData , {headers: {
      "Content-Type": "multipart/form-data",
    },});
    
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


export const deleteMessageApiCall = async (messageId : string): Promise<{ success: true; message: string } | { success: false; error: string }> => {
  try {
    const response = await api.delete(`/messages/${messageId}/soft`);

    return {
      success: true,
      message: response.data.message || "Message deleted successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred while deleting the message.",
    };
  }
};

export const getMessagesByChannelIdApiCall = async (
  channelId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<MessageApiResponse> => {
  try {
    const response = await api.get(`/messages/channel/${channelId}`, {
      params: {
        page,
        pageSize
      }
    });
    
    return {
      success: true,
      message: response.data.message,
      result: {
        messages: response.data.result.messages,
        page: response.data.result.page,
        pageSize: response.data.result.pageSize,
        totalCount: response.data.result.totalCount
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
      statusCode: error.response?.data?.statusCode || 500
    };
  }
};
