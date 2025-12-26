import api from './api';
import { DashboardStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/admin/dashboard/stats');
    return response.data;
  },
};
