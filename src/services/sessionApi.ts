import apiClient from './api';
import { ApiResponse } from '../types/api';
import { SessionStatusCheck } from '../types/session';

export const sessionApi = {
  checkStatus: async (sessionCode: string): Promise<ApiResponse<SessionStatusCheck>> => {
    const res = await apiClient.get<ApiResponse<SessionStatusCheck>>(
      `/session/${sessionCode}/status`
    );
    return res.data;
  },
};
