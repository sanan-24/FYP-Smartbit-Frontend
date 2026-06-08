import apiClient from './client';

export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiClient.get('/orders/my-orders');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.patch(`/orders/${id}/status`, { status });
  return response.data;
};

export const assignRider = async (orderId, riderId) => {
  const response = await apiClient.patch(`/orders/${orderId}/assign-rider`, { riderId });
  return response.data;
};

export const getAssignedOrders = async () => {
  const response = await apiClient.get('/orders/assigned');
  return response.data;
};

export const getRiderStats = async () => {
  const response = await apiClient.get('/orders/rider-stats');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};
