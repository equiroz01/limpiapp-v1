import api from './api';
import { HousekeeperWithUser, PaginatedResponse, VerificationStatus } from '../types';

export const housekeepersService = {
  async getHousekeepers(page = 1, limit = 10, search?: string, verificationStatus?: VerificationStatus): Promise<PaginatedResponse<HousekeeperWithUser>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(verificationStatus && { verificationStatus }),
    });

    const response = await api.get<PaginatedResponse<HousekeeperWithUser>>(`/admin/housekeepers?${params}`);
    return response.data;
  },

  async getHousekeeperById(id: string): Promise<HousekeeperWithUser> {
    const response = await api.get<HousekeeperWithUser>(`/admin/housekeepers/${id}`);
    return response.data;
  },

  async updateHousekeeperStatus(id: string, status: string): Promise<HousekeeperWithUser> {
    const response = await api.patch<HousekeeperWithUser>(`/admin/housekeepers/${id}/status`, { status });
    return response.data;
  },

  async updateVerificationStatus(id: string, verificationStatus: VerificationStatus): Promise<HousekeeperWithUser> {
    const response = await api.patch<HousekeeperWithUser>(`/admin/housekeepers/${id}/verification`, { verificationStatus });
    return response.data;
  },
};
