import axiosClient from "./axiosClient";

export const businessHotelApi = {
  getMyHotel: async () => {
    return axiosClient.get("/business/hotel");
  },

  createHotel: async (data) => {
    return axiosClient.post("/business/hotel", data);
  },

  updateHotel: async (data) => {
    return axiosClient.put("/business/hotel", data);
  },

  updateHotelImages: async (images) => {
    return axiosClient.put("/business/hotel/images", { images });
  },

  getHotelStats: async () => {
    return axiosClient.get("/business/hotel/stats");
  },

  createAmenities: async (lodgingId, amenities) => {
    return axiosClient.post("/business/amenities", {
      lodging_id: lodgingId,
      ...amenities,
    });
  },

  updateAmenities: async (amenityId, amenities) => {
    return axiosClient.put(`/business/amenities/${amenityId}`, amenities);
  },
};

export default businessHotelApi;
