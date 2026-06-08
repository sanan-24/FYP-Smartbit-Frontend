import apiClient from './client';

const riderApi = {
  create: async (riderData) => {
    const response = await apiClient.post('riders/create', riderData);
    return response.data;
  },
  getAll: async () => {
    const response = await apiClient.get('riders/all');
    return response.data;
  },
  getAvailable: async () => {
    const response = await apiClient.get('riders/available');
    return response.data;
  },
  toggleAvailability: async (statusData) => {
    const response = await apiClient.patch('riders/toggle-status', statusData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`riders/${id}`);
    return response.data;
  },
  updateLocation: async (locationData) => {
    const response = await apiClient.patch('riders/location', locationData);
    return response.data;
  },
  getLocation: async (id) => {
    const response = await apiClient.get(`riders/${id}/location`);
    return response.data;
  }
};

export default riderApi;
