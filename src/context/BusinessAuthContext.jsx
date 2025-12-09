import { createContext, useState, useEffect } from "react";
import businessAuthApi from "../api/businessAuthApi";

export const BusinessAuthContext = createContext(null);

export const BusinessAuthProvider = ({ children }) => {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("businessToken");
      if (token) {
        const response = await businessAuthApi.getMyInfo();
        // 백엔드 응답 구조: { data: {...}, message, resultCode }
        const businessInfo = response?.data || response;
        setBusinessInfo(businessInfo);
      }
    } catch (error) {
      localStorage.removeItem("businessToken");
      console.error("인증 확인 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await businessAuthApi.login(credentials);
    // 백엔드 응답 구조: { data: { token, business }, message, resultCode }
    const token = response?.data?.token || response?.token;
    const business = response?.data?.business || response?.business;
    
    if (token) {
      localStorage.setItem("businessToken", token);
    }
    if (business) {
      setBusinessInfo(business);
    }
    
    console.log("로그인 응답:", response);
    
    // 호텔 정보 확인을 위해 반환값에 hasHotel 플래그 추가
    const hasHotel = await checkHotelExists();
    return { hasHotel };
  };
  
  const checkHotelExists = async () => {
    try {
      const { businessHotelApi } = await import("../api/businessHotelApi");
      const hotelData = await businessHotelApi.getMyHotel();
      // 백엔드 응답 구조에 따라 조정 필요
      const hotel = hotelData?.data || hotelData;
      return !!(hotel && hotel.id); // 호텔이 존재하는지 확인
    } catch (error) {
      // 호텔이 없거나 에러가 발생한 경우 (404 등)
      if (error.response?.status === 404) {
        return false;
      }
      console.log("호텔 정보 확인 실패:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await businessAuthApi.logout();
    } finally {
      localStorage.removeItem("businessToken");
      setBusinessInfo(null);
    }
  };

  const signup = async (userData) => {
    const response = await businessAuthApi.signup(userData);
    // 백엔드 응답 구조: { data: { token, business }, message, resultCode }
    const token = response?.data?.token || response?.token;
    const business = response?.data?.business || response?.business;
    
    if (token) {
      localStorage.setItem("businessToken", token);
    }
    if (business) {
      setBusinessInfo(business);
    }
    
    console.log("회원가입 응답:", response);
    
    // 신규 가입자는 호텔이 없으므로 false 반환
    return { hasHotel: false };
  };

  const kakaoLogin = async (kakaoToken) => {
    const response = await businessAuthApi.kakaoLogin(kakaoToken);
    // 백엔드 응답 구조: { data: { token, business, needsAdditionalInfo }, message, resultCode }
    const data = response?.data || response;
    
    // 추가 정보가 필요한 경우
    if (data.needsAdditionalInfo) {
      return {
        needsAdditionalInfo: true,
        tempUserId: data.tempUserId,
      };
    }
    
    // 바로 로그인 가능한 경우
    const token = data.token;
    if (token) {
      localStorage.setItem("businessToken", token);
    }
    if (data.business) {
      setBusinessInfo(data.business);
    }
    return {
      needsAdditionalInfo: false,
    };
  };

  return (
    <BusinessAuthContext.Provider
      value={{ businessInfo, loading, login, logout, signup, checkAuth, kakaoLogin }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
};

export default BusinessAuthContext;
