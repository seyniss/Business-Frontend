import axiosClient from "./axiosClient";
import { mockHotelApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const businessHotelApi = {
  getMyHotel: async () => {
    if (USE_MOCK) return mockHotelApi.getMyHotel();
    return axiosClient.get("/business/hotel");
  },

  updateHotel: async (data) => {
    if (USE_MOCK) return mockHotelApi.updateHotel(data);
    return axiosClient.put("/business/hotel", data);
  },

  updateHotelImages: async (images) => {
    if (USE_MOCK) return mockHotelApi.updateImages(images);
    return axiosClient.put("/business/hotel/images", { images });
  },

  getHotelStats: async () => {
    if (USE_MOCK) return mockHotelApi.getStats();
    return axiosClient.get("/business/hotel/stats");
  },
};

export default businessHotelApi;
