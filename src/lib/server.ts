import { Server, ServerCreation } from "@/types/server";
import api from "./api";

export const getServersForUserProfileApiCall = async (profileId: string): Promise<
  { success: true; message: string; servers: Server[] } |
  { success: false; error: string }
> => {
  try {
    const response = await api.get(`/servers/member/profile/${profileId}`);
    
    return {
      success: true,
      message: response.data.message,
      servers: response.data.result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

export const createServerApiCall = async (
  server: ServerCreation
): Promise<{ success: true; message: string , server : Server } | { success: false; error: string }> => {
  try {
    const formData = new FormData();
    formData.append("name", server.name);
    formData.append("profileId", server.profileId);

    if (server.image) {
      formData.append("image", server.image);
    }

    const response = await api.post("/servers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data.message,
      server : response.data.result
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred while creating the server.",
    };
  }
};

export const getServerWithDetailsByIdApiCall = async (serverId: string): Promise<
  { success: true; message: string; server: Server } |
  { success: false; error: string }
> => {
  try {
    const response = await api.get(`/servers/details/${serverId}`);
    
    return {
      success: true,
      message: response.data.message,
      server: response.data.result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

export const getServerByInviteCodeApiCall = async (inviteCode: string): Promise<
  { success: true; message: string; result : Server  } |
  { success: false; error: string }
> => {
  try {
    const response = await api.get(`/servers/invite/${inviteCode}`);
    
    return {
      success: true,
      message: response.data.message,
      result: response.data.result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

export const generateNewInviteCodeApiCall = async (serverId: string): Promise<
  { success: true; message: string; inviteCode: string } |
  { success: false; error: string }
> => {
  try {
    const response = await api.post(`/servers/${serverId}/generate-invite-code`);
    
    return {
      success: true,
      message: response.data.message,
      inviteCode: response.data.result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

export const updateServerApiCall = async (
  serverId: string,
  formData: FormData
): Promise<{ success: true; message: string; server: Server } | { success: false; error: string }> => {
  try {
    const response = await api.put(`/servers/${serverId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      message: response.data.message,
      server: response.data.result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred while updating the server.",
    };
  }
};

export const deleteServerApiCall = async (
  requesterProfileId : string , serverId: string,
): Promise<{ success: true; message: string;} | { success: false; error: string }> => {
  try {
    const response = await api.delete(`/servers/${serverId}/profile/${requesterProfileId}`);

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred while deleting the server.",
    };
  }
};

