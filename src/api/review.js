import apiClient from './client';

const reviewApi = {
  addReview: async (reviewData) => {
    const response = await apiClient.post('reviews', reviewData);
    return response.data;
  },
  getProductReviews: async (productId) => {
    const response = await apiClient.get(`reviews/product/${productId}`);
    return response.data;
  },
  getRiderReviews: async (riderId) => {
    const response = await apiClient.get(`reviews/rider/${riderId}`);
    return response.data;
  }
};

export default reviewApi;
