import apiClient from './client';

const adminApi = {
  getStats: async (params = {}) => {
    const response = await apiClient.get('admin/stats', { params });
    return response.data;
  }
};

export default adminApi;
