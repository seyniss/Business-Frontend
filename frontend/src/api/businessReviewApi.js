import axiosClient from "./axiosClient";
import { mockReviewApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const businessReviewApi = {
  getReviews: async (params) => {
    if (USE_MOCK) return mockReviewApi.getReviews(params);
    return axiosClient.get("/business/reviews", { params });
  },

  getReviewById: async (id) => {
    if (USE_MOCK) return mockReviewApi.getReviewById(id);
    return axiosClient.get(`/business/reviews/${id}`);
  },

  replyToReview: async (id, reply) => {
    if (USE_MOCK) return mockReviewApi.reply(id, reply);
    return axiosClient.post(`/business/reviews/${id}/reply`, { reply });
  },

  reportReview: async (id, reason) => {
    if (USE_MOCK) return mockReviewApi.report(id, reason);
    return axiosClient.post(`/business/reviews/${id}/report`, { reason });
  },

  getReviewStats: async () => {
    if (USE_MOCK) return mockReviewApi.getStats();
    return axiosClient.get("/business/reviews/stats");
  },
};

export default businessReviewApi;
