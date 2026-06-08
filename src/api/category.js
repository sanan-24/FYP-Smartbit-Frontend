import apiClient from './client';

const categoryApi = {
  getAll: async () => {
    const response = await apiClient.get('categories');
    return response.data;
  },
  create: async (categoryData) => {
    const response = await apiClient.post('categories', categoryData);
    return response.data;
  },
  update: async (id, categoryData) => {
    const response = await apiClient.patch(`categories/${id}`, categoryData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`categories/${id}`);
    return response.data;
  },
};

export default categoryApi;
