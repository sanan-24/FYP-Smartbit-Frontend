import apiClient from './client';

const favoriteApi = {
  getMyFavorites: async () => {
    const response = await apiClient.get('favorites');
    return response.data;
  },
  toggleFavorite: async (productId) => {
    const response = await apiClient.post('favorites', { productId });
    return response.data;
  },
};

export default favoriteApi;
