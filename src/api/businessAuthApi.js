import axiosClient from "./axiosClient";
import { mockAuthApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

const businessAuthApi = {
  login: async (credentials) => {
    if (USE_MOCK) {
      return mockAuthApi.login(credentials);
    }
    return axiosClient.post("/business/auth/login", credentials);
  },

  logout: async () => {
    if (USE_MOCK) {
      return mockAuthApi.logout();
    }
    return axiosClient.post("/business/auth/logout");
  },

  getMyInfo: async () => {
    if (USE_MOCK) {
      return mockAuthApi.getMyInfo();
    }
    return axiosClient.get("/business/auth/me");
  },

  changePassword: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.changePassword(data);
    }
    return axiosClient.put("/business/auth/password", data);
  },

  forgotPassword: async (email) => {
    if (USE_MOCK) {
      return mockAuthApi.forgotPassword(email);
    }
    return axiosClient.post("/business/auth/forgot-password", { email });
  },

  signup: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.signup(data);
    }
    return axiosClient.post("/business/auth/signup", data);
  },

  updateProfile: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.updateProfile(data);
    }
    return axiosClient.put("/business/auth/profile", data);
  },

  kakaoLogin: async (kakaoToken) => {
    if (USE_MOCK) {
      return mockAuthApi.kakaoLogin(kakaoToken);
    }
    return axiosClient.post("/business/auth/kakao", { access_token: kakaoToken });
  },

  completeKakaoSignup: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.completeKakaoSignup(data);
    }
    return axiosClient.post("/business/auth/kakao/complete", data);
  },
};

export { businessAuthApi };
export default businessAuthApi;
