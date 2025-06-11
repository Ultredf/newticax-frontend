import axios from 'axios';

// CRITICAL: Enhanced API configuration for authentication
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: Must be true for cookies
  timeout: 30000, // 30 seconds timeout
});

// Enhanced request interceptor with debugging
api.interceptors.request.use(
  (config) => {
    const isAuthRequest = config.url?.includes('/auth/');
    
    if (isAuthRequest) {
      console.log('🔄 Auth API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        withCredentials: config.withCredentials,
        timestamp: new Date().toISOString(),
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with detailed logging
api.interceptors.response.use(
  (response) => {
    const isAuthRequest = response.config.url?.includes('/auth/');
    
    if (isAuthRequest) {
      console.log('✅ Auth API Response:', {
        status: response.status,
        url: response.config.url,
        success: response.data?.success,
        hasData: !!response.data?.data,
        hasCookie: !!response.headers['set-cookie'],
        timestamp: new Date().toISOString(),
      });
      
      // Log cookie information if present
      if (response.headers['set-cookie']) {
        console.log('🍪 Set-Cookie headers:', response.headers['set-cookie']);
      }
    }
    
    return response;
  },
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/');
    
    if (isAuthRequest) {
      console.error('❌ Auth API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message,
        code: error.response?.data?.code,
        data: error.response?.data,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Handle specific auth errors
    if (error.response?.status === 401) {
      // Clear any local auth state on 401
      const event = new CustomEvent('auth:logout');
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

// Add a method to check API health
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/health`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// Add method to test authentication
export const testAuth = async () => {
  try {
    const response = await api.get('/auth/me');
    console.log('🔍 Auth test result:', response.data);
    return response.data;
  } catch (error) {
    console.error('🔍 Auth test failed:', error);
    throw error;
  }
};

export default api;