import axiosClient from "./axiosClient";
import { mockRoomApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const businessRoomApi = {
  getRooms: async (params) => {
    if (USE_MOCK) return mockRoomApi.getRooms(params);
    return axiosClient.get("/business/rooms", { params });
  },

  getRoomById: async (id) => {
    if (USE_MOCK) return mockRoomApi.getRoomById(id);
    return axiosClient.get(`/business/rooms/${id}`);
  },

  createRoom: async (data) => {
    if (USE_MOCK) return mockRoomApi.create(data);
    return axiosClient.post("/business/rooms", data);
  },

  updateRoom: async (id, data) => {
    if (USE_MOCK) return mockRoomApi.update(id, data);
    return axiosClient.put(`/business/rooms/${id}`, data);
  },

  deleteRoom: async (id) => {
    if (USE_MOCK) return mockRoomApi.delete(id);
    return axiosClient.delete(`/business/rooms/${id}`);
  },

  updateRoomStatus: async (id, status) => {
    if (USE_MOCK) return mockRoomApi.updateStatus(id, status);
    return axiosClient.patch(`/business/rooms/${id}/status`, { status });
  },
};

export default businessRoomApi;
