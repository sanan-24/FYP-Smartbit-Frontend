import apiClient from './client';

const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('auth/login', credentials);
    return response.data;
  },
  signup: async (userData) => {
    const response = await apiClient.post('auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get('auth/me');
    return response.data;
  },
  verifyEmail: async (token) => {
    const response = await apiClient.get('auth/verify-email', {
      params: { token }
    });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await apiClient.post('auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (resetData) => {
    const response = await apiClient.post('auth/reset-password', resetData);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('auth/logout');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await apiClient.patch('profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default authApi;
