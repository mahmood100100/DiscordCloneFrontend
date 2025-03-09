import api from '@/lib/api';
import { User } from '@/types/auth';

export const axiosRefreshTokenCall = async () => {
  try {
    const response = await api.post('/users/refresh-token');

    if (response.status === 200) {
      const { accessToken } = response.data;
      return accessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    throw new Error('Error refreshing token, network error');
  }
};


export const loginApiCall = async (
  email: string,
  password: string
): Promise<
  | { success: true; accessToken: string; user: User; expiresIn: number }
  | { success: false; error: string }
> => {
  try {
    const response = await api.post('/users/login', { email, password });

    const { accessToken, user, expiresIn } = response.data.result;

    return { success: true, accessToken, user, expiresIn };
  } catch (error: any) {
    if (error.response) {
      return { success: false, error: error.response.data.message || "Unexpected error during login!" };
    } else {
      return { success: false, error: "Network error or server unreachable!" };
    }
  }
};

export const registerApiCall = async (formData: FormData): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    
    const response = await api.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    
    if (error.response) {
      return { success: false, error: error.response.data.errors || "Registration failed!" };
    } else {
      return { success: false, error: "Network error or server unreachable!" };
    }
  }
};

export const logoutApiCall = async () => {
  try {
    await api.post('/users/logout');
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Logout failed' }
  }
};

export const forgetPasswordApiCall = async (email: string): Promise<
  { success: true; resetPasswordToken: string }
  | { success: false; error: string }> => {
  try {
    const response = await api.post('/users/send-reset-email', { email });
    return { success: true, resetPasswordToken: response.data.result }
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'request failed' }
  }
}

export const resetPasswordApiCall = async (token: string, newPassword: string, confirmedNewPassword: string, email: string) => {
  try {
    await api.post('/users/reset-password', { token, newPassword, confirmedNewPassword, email });

  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message || 'reset password failed' }
  }
}

export const sendVerificationEmailApiCall = async (email: string): Promise<
  { success: true; message: string }
  | { success: false; error: string }
> => {
  try {
    const response = await api.post('/users/send-verification-email', { email });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'request failed' };
  }
};

export const updateUserApiCall = async (formData: FormData): Promise<
  { success: true; message: string , result : User }
  | { success: false; error: string }
> => {
  try {
    const response = await api.put("/users", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, message : response.data.message ,  result: response.data.result };
  } catch (error: any) {
    if (error.response) {
      return { success: false, error: error.response.data.message || "Failed to update user settings!" };
    } else {
      return { success: false, error: "Network error or server unreachable!" };
    }
  }
};

export const changePasswordApiCall = async (
  data: { id: string; currentPassword: string; newPassword: string }
): Promise<
  { success: boolean; message: string ,error?: string }
> => {
  try {
    const response = await api.post("/users/change-password", data);
    return { success: true, message: response.data.message };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message : "" ,  error: error.response.data.message || "Failed to change password!" };
    } else {
      return { success: false , message : "", error: "Network error or server unreachable!" };
    }
  }
};
