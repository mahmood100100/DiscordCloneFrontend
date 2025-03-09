import { Channel } from "@/types/channel";
import api from "./api";

export const createChannelApiCall = async (requesterProfileId : string , name : string , type : number ,serverId : string ): Promise<
  { success: true; message: string; result : Channel  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.post(`/channels` , {requesterProfileId , name , type , serverId});
    
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

export const updateChannelApiCall = async (
  requesterProfileId : string ,
   channelId : string ,
   channelName : string ,
   serverId : string
  ): Promise<
  { success: true; message: string; result : Channel  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.put(`/channels` , {requesterProfileId , channelId , channelName, serverId});
    
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


export const deleteChannelApiCall = async (
  requesterProfileId: string,
  channelId: string,
  serverId: string
): Promise<{ success: true; message: string } | { success: false; error: string }> => {
  try {
    const response = await api.delete("/channels", {
      data: {
        requesterProfileId,
        channelId,
        serverId,
      },
    });

    return {
      success: true,
      message: response.data.message || "Channel deleted successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred while deleting the channel.",
    };
  }
};

export const getChannelById = async (channelId : string): Promise<
  { success: true; message: string; result : Channel  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.get(`/channels/${channelId}`);
    
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
