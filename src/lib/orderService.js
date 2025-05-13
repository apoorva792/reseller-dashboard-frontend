// This service wraps the order API calls and handles the special case of user ID 0
import { orderApi } from './api';

// Get the current user ID from localStorage
const getCurrentUserId = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.customer_id;
    }
    return null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Override the getAllOrders function to handle user ID 0
export const getAllOrders = async (filters = {}) => {
  try {
    // If user ID is 0, add a special parameter to bypass the buyer_id filter in the backend
    if (getCurrentUserId() === 0) {
      console.log('User ID is 0, using bypass_buyer_filter parameter');
      
      // You would normally modify your backend to accept this parameter
      // For now, we'll add it and also use direct database access if needed
      filters.bypass_buyer_filter = true;
    }
    
    const response = await orderApi.getAllOrders(filters);
    
    // If still no orders and user ID is 0, try to fetch all orders regardless of buyer_id
    if (getCurrentUserId() === 0 && (!response.orders || response.orders.length === 0)) {
      console.log('No orders found with filter. Attempting direct fetch for user ID 0');
      
      // In a real implementation, you'd modify the backend to handle this special case
      // For now, we'll just log it and return the original response
      console.log('Please implement a special case in the backend for user ID 0');
    }
    
    return response;
  } catch (error) {
    console.error('Error in getAllOrders service:', error);
    throw error;
  }
};

// Also override getConfirmedOrders and other specific order functions
export const getConfirmedOrders = async (filters = {}) => {
  try {
    if (getCurrentUserId() === 0) {
      filters.bypass_buyer_filter = true;
    }
    return await orderApi.getConfirmedOrders(filters);
  } catch (error) {
    console.error('Error in getConfirmedOrders service:', error);
    throw error;
  }
};

export const getUnshippedOrders = async (filters = {}) => {
  try {
    if (getCurrentUserId() === 0) {
      filters.bypass_buyer_filter = true;
    }
    return await orderApi.getUnshippedOrders(filters);
  } catch (error) {
    console.error('Error in getUnshippedOrders service:', error);
    throw error;
  }
};

// Export other functions as needed, with the same pattern 