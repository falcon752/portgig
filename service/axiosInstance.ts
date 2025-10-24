import { BASE_URL } from '@/src/utils/apiUtil';
import axios from 'axios';

export const unauthApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

authApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {

      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);