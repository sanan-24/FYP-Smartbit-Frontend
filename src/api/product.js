import apiClient from './client';

const productApi = {
  getAll: async (params) => {
    const response = await apiClient.get('products', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`products/${id}`);
    return response.data;
  },
  create: async (productData) => {
    const response = await apiClient.post('products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id, productData) => {
    const response = await apiClient.patch(`products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`products/${id}`);
    return response.data;
  },
};

export default productApi;
