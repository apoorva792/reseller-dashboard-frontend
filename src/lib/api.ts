// src/utils/api.ts

import axios from 'axios';
import { toast } from 'sonner';

// API Base URLs - Use environment variables or fallback to local development URLs
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8002';
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8001';
const BILL_SERVICE_URL = import.meta.env.VITE_BILL_SERVICE_URL || 'http://localhost:8003';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Common axios config
const axiosConfig = {
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Create axios instances for each service
const userApi = axios.create({
  ...axiosConfig,
  baseURL: USER_SERVICE_URL
});

const orderApiClient = axios.create({
  ...axiosConfig,
  baseURL: ORDER_SERVICE_URL
});

// Add request interceptor for bill API
const billApiClient = axios.create({
  ...axiosConfig,
  baseURL: BILL_SERVICE_URL
});

// Add request interceptor to include authentication token for both APIs
const addAuthToken = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

// Add request interceptor for order API
orderApiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// Add request interceptor for user API
userApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// Add request interceptor for bill API
billApiClient.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// Add request debug interceptor
const requestDebugInterceptor = (config) => {
  // Log request for debugging
  console.log('Request:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers
  });
  return config;
};

userApi.interceptors.request.use(requestDebugInterceptor);
orderApiClient.interceptors.request.use(requestDebugInterceptor);
billApiClient.interceptors.request.use(requestDebugInterceptor);

// Add response interceptor for debugging
const responseSuccessInterceptor = (response) => {
  console.log('Response:', response.data);
  return response;
};

const responseErrorInterceptor = (error) => {
  console.error('Response Error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });
  
  // Handle authentication errors (401)
  if (error.response?.status === 401) {
    // Clear tokens and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // If not already on the login page, redirect
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  
  return Promise.reject(error);
};

userApi.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);
orderApiClient.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);
billApiClient.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);

// Auth API functions
export const authApi = {
  register: async (data: any) => {
    try {
      console.log('Registering user with data:', data);
      const response = await userApi.post('/register', data);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      // Log more details about the error
      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
      }
      throw error;
    }
  },

  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await userApi.post('/login', { email, password });
      const { access_token, refresh_token, user } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Order API functions
export const orderApi = {
  getAllOrders: async (filters: any = {}) => {
    try {
      // Convert frontend filter names to what backend expects
      const params = {
        page: filters.page || 1,
        page_size: filters.page_size || 20,
        // Only include non-empty filters
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
        ...(filters.order_search_item && { order_search_item: filters.order_search_item }),
        ...(filters.source_option && filters.source_option !== "All" && { source_option: filters.source_option }),
        // Add sort option
        store_by: filters.store_by || "last_modified"
      };
      
      const response = await orderApiClient.get('/orders/get-all-orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch all orders:', error);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  getConfirmedOrders: async (filters: any = {}) => {
    try {
      // Convert frontend filter names to what backend expects
      const params = {
        page: filters.page || 1,
        page_size: filters.page_size || 20,
        // Only include non-empty filters
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
        ...(filters.order_search_item && { order_search_item: filters.order_search_item }),
        ...(filters.source_option && filters.source_option !== "All" && { source_option: filters.source_option }),
        store_by: filters.store_by || "last_modified"
      };
      
      const response = await orderApiClient.get('/orders/get-confirmed-orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch confirmed orders:', error);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  getUnshippedOrders: async (filters: any = {}) => {
    try {
      // Convert frontend filter names to what backend expects
      const params = {
        page: filters.page || 1,
        page_size: filters.page_size || 20,
        // Only include non-empty filters
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
        ...(filters.order_search_item && { order_search_item: filters.order_search_item }),
        ...(filters.source_option && filters.source_option !== "All" && { source_option: filters.source_option }),
        store_by: filters.store_by || "last_modified"
      };
      
      const response = await orderApiClient.get('/orders/get-unshipped-orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch unshipped orders:', error);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  getUnpaidOrders: async (filters: any = {}) => {
    try {
      // Convert frontend filter names to what backend expects
      const params = {
        page: filters.page || 1,
        page_size: filters.page_size || 20,
        // Only include non-empty filters
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
        ...(filters.order_search_item && { order_search_item: filters.order_search_item }),
        ...(filters.source_option && filters.source_option !== "All" && { source_option: filters.source_option }),
        store_by: filters.store_by || "last_modified"
      };
      
      const response = await orderApiClient.get('/orders/get-unpaid-orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch unpaid orders:', error);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  getReturnedOrders: async (filters: any = {}) => {
    try {
      // Convert frontend filter names to what backend expects
      const params = {
        page: filters.page || 1,
        page_size: filters.page_size || 20,
        // Only include non-empty filters
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
        ...(filters.order_search_item && { order_search_item: filters.order_search_item }),
        ...(filters.source_option && filters.source_option !== "All" && { source_option: filters.source_option }),
        store_by: filters.store_by || "last_modified"
      };
      
      const response = await orderApiClient.get('/orders/get-returned-orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch returned orders:', error);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  getCancelledOrders: async (filters: any = {}) => {
    try {
      // Convert frontend filter names to what backend expects
      const params = {
        page: filters.page || 1,
        page_size: filters.page_size || 20,
        // Only include non-empty filters
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date }),
        ...(filters.order_search_item && { order_search_item: filters.order_search_item }),
        ...(filters.source_option && filters.source_option !== "All" && { source_option: filters.source_option }),
        store_by: filters.store_by || "last_modified"
      };
      
      const response = await orderApiClient.get('/orders/get-cancelled-orders', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch cancelled orders:', error);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  getOrderById: async (orderId: string) => {
    try {
      const response = await orderApiClient.get(`/orders/order/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch order ${orderId}:`, error);
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
      }
      throw error;
    }
  },
  
  uploadOrders: async (file: File) => {
    try {
      // Get authentication token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Log what we're sending for debugging
      console.log('Uploading file:', file.name, file.type, file.size);
      
      // Make the request with proper auth headers
      const response = await orderApiClient.post('/orders/upload', formData, {
        headers: {
          // Note: Don't set Content-Type for FormData, the browser will set it with the correct boundary
          'Content-Type': undefined,
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Add longer timeout for uploads
        timeout: 60000
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to upload orders:', error);
      
      // Handle specific error cases
      if (error.response) {
        console.error('Error details:', error.response.status, error.response.data);
        
        if (error.response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        if (error.response.status === 422) {
          if (error.response.data?.detail) {
            if (Array.isArray(error.response.data.detail)) {
              throw new Error(`Validation error: ${error.response.data.detail[0]}`);
            } else {
              throw new Error(`Validation error: ${error.response.data.detail}`);
            }
          }
        }
      }
      
      throw error;
    }
  }
};

// Wallet and Billing API functions
export const walletApi = {
  getBalance: async () => {
    try {
      const response = await userApi.get('/wallet/balance');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      // Return mock data if API fails in development mode
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          data: {
            currencies_balance: 370001.00, // Updated to requested amount
            currency_symbol: '₹'
          }
        };
      }
      throw error;
    }
  },
  
  rechargeWallet: async (amount: number, paymentMethod: string) => {
    try {
      const response = await userApi.post('/wallet/recharge', {
        amount,
        payment_method: paymentMethod
      });
      return response.data;
    } catch (error) {
      console.error('Failed to recharge wallet:', error);
      throw error;
    }
  },
  
  getTransactions: async (filters: any = {}) => {
    try {
      const params = {
        page: filters.page || 1,
        page_size: filters.pageSize || 20,
        ...(filters.transactionType && { bill_type: filters.transactionType }),
        ...(filters.startDate && { start_date: filters.startDate }),
        ...(filters.endDate && { end_date: filters.endDate }),
        ...(filters.orderId && { order_id: filters.orderId })
      };
      
      const response = await billApiClient.get('/bills', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet transactions:', error);
      
      // Return mock data if API fails in development mode
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          data: {
            bills: [],
            total: 0,
            page: 1,
            pages: 1
          }
        };
      }
      throw error;
    }
  },
  
  getTransactionById: async (transactionId: number) => {
    try {
      const response = await billApiClient.get(`/bills/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch transaction ${transactionId}:`, error);
      throw error;
    }
  }
};
