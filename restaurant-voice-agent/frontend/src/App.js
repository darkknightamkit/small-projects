import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bookingAPI = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get all bookings
  getAllBookings: async (filters = {}) => {
    const response = await api.get('/bookings', { params: filters });
    return response.data;
  },

  // Get specific booking
  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (bookingId, updates) => {
    const response = await api.put(`/bookings/${bookingId}`, updates);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get weather
  getWeather: async (date, location = 'New York') => {
    const response = await api.post('/weather', { date, location });
    return response.data;
  },

  // Get analytics
  getAnalytics: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  }
};

export default api;