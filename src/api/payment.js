import apiClient from './client';

const paymentApi = {
  createPaymentIntent: async (paymentData) => {
    const response = await apiClient.post('payments/create-intent', paymentData);
    return response.data;
  }
};

export default paymentApi;
