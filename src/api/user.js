import apiClient from './client';

const userApi = {
  getAll: async (data = {}) => {
    const response = await apiClient.get('users', data);
    return response.data;
  },
  updateRole: async (id, role) => {
    const response = await apiClient.patch(`users/${id}/role`, { role });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`users/${id}`);
    return response.data;
  }
};

export default userApi;
