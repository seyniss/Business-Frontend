import axiosClient from "./axiosClient";
import { mockBookingApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const businessBookingApi = {
  getBookings: async (params) => {
    if (USE_MOCK) return mockBookingApi.getBookings(params);
    return axiosClient.get("/business/bookings", { params });
  },

  getBookingById: async (id) => {
    if (USE_MOCK) return mockBookingApi.getBookingById(id);
    return axiosClient.get(`/business/bookings/${id}`);
  },

  updateBookingStatus: async (id, status) => {
    if (USE_MOCK) return mockBookingApi.updateBookingStatus(id, status);
    return axiosClient.patch(`/business/bookings/${id}/status`, { status });
  },

  getBookingStats: async () => {
    if (USE_MOCK) return mockBookingApi.getStats();
    return axiosClient.get("/business/bookings/stats");
  },
};

export default businessBookingApi;
