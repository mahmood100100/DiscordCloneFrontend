import api from "./api";
import { DmApiResponse, UpdateDmApiResponse } from "@/types/api";
import { DirectMessage } from "@/types/direct-message";


export const createDirectMessageApiCall = async (formData : FormData ): Promise<
  { success: true; message: string; result : DirectMessage  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.post(`/directMessages` , formData , {headers: {
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

export const updateDirectMessageApiCall = async (formData : FormData):
 Promise<UpdateDmApiResponse> => {
  try {
    const response = await api.put(`/directMessages` , formData , {headers: {
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


export const deleteDirectMessageApiCall = async (messageId : string): Promise<{ success: true; message: string } | { success: false; error: string }> => {
  try {
    const response = await api.delete(`/directMessages/${messageId}/soft`);

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

export const getDirectMessagesByConversationIdApiCall = async (
  conversationId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<DmApiResponse> => {
  try {
    const response = await api.get(`/directMessages/by-conversation/${conversationId}`, {
      params: {
        page,
        pageSize
      }
    });
    
    return {
      success: true,
      message: response.data.message,
      result: {
        directMessages: response.data.result.messages,
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
