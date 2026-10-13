import apiClient from '@/lib/api-client';

import type {
  AdminLoginRequest,
  AdminLoginResponse,
} from '@/types/auth.types';

import type { ApiResponse } from '@/types/api.types';

export const loginAdmin = async (
  payload: AdminLoginRequest,
): Promise<ApiResponse<AdminLoginResponse>> => {
  const response = await apiClient.post<
    ApiResponse<AdminLoginResponse>
  >('/auth/login', payload);

  return response?.data;
};
