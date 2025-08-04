// config/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method, config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error || 
                        error.message || 
                        'Something went wrong';
    
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage
    });

    // You can show toast notification here if you want
    // alert(`Error: ${errorMessage}`); 

    return Promise.reject(errorMessage);
  }
);

export default api;