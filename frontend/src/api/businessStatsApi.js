import axiosClient from "./axiosClient";
import { mockStatsApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const businessStatsApi = {
  getDashboardStats: async () => {
    if (USE_MOCK) return mockStatsApi.getDashboardStats();
    return axiosClient.get("/business/stats/dashboard");
  },

  getStatistics: async (params) => {
    if (USE_MOCK) return mockStatsApi.getStatistics(params);
    return axiosClient.get("/business/stats", { params });
  },

  getRevenueStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getRevenueStats(period);
    return axiosClient.get("/business/stats/revenue", { params: { period } });
  },

  getBookingStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getBookingStats(period);
    return axiosClient.get("/business/stats/bookings", { params: { period } });
  },

  getOccupancyStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getOccupancyStats(period);
    return axiosClient.get("/business/stats/occupancy", { params: { period } });
  },
};

export default businessStatsApi;
