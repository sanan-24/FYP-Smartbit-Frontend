import apiClient from './client';

const aiApi = {
  getSuggestions: async (query) => {
    const response = await apiClient.post('ai/suggest', { query });
    return response.data;
  }
};

export default aiApi;
