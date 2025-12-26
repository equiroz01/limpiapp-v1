import api from './api';
import { ClientWithUser, PaginatedResponse } from '../types';

export const clientsService = {
  async getClients(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<ClientWithUser>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await api.get<PaginatedResponse<ClientWithUser>>(`/admin/clients?${params}`);
    return response.data;
  },

  async getClientById(id: string): Promise<ClientWithUser> {
    const response = await api.get<ClientWithUser>(`/admin/clients/${id}`);
    return response.data;
  },

  async updateClientStatus(id: string, status: string): Promise<ClientWithUser> {
    const response = await api.patch<ClientWithUser>(`/admin/clients/${id}/status`, { status });
    return response.data;
  },
};
