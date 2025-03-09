import api from "@/lib/api";
import { Member } from "@/types/member";

export const addMemberToServerApiCall = async (serverId : string , profileId : string): Promise<
  { success: true; message: string; result : Member  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.post(`/members` , {serverId , profileId});
    
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

export const updateMemberDataApiCall = async (
  requesterProfileId : string ,
   targetMemberId : string ,
   newRole : number ,
   serverId : string
  ): Promise<
  { success: true; message: string; result : Member  } |
  { success: false; error: string , statusCode : number }
> => {
  try {
    const response = await api.post(`/members/change-role` , {requesterProfileId , targetMemberId , newRole, serverId});
    
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

export const deleteMemberApiCall = async (
  requesterProfileId: string,
  targetMemberId: string,
  serverId: string
): Promise<{ success: true; message: string } | { success: false; error: string }> => {
  try {
    const response = await api.delete("/members/soft-delete", {
      data: {
        requesterProfileId,
        targetMemberId,
        serverId,
      },
    });

    return {
      success: true,
      message: response.data.message || "Member deleted successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred while deleting the member.",
    };
  }
};