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
        const data = await businessAuthApi.getMyInfo();
        setBusinessInfo(data);
      }
    } catch (error) {
      localStorage.removeItem("businessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await businessAuthApi.login(credentials);
    localStorage.setItem("businessToken", data.token);
    setBusinessInfo(data.business);
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
    const data = await businessAuthApi.signup(userData);
    localStorage.setItem("businessToken", data.token);
    setBusinessInfo(data.business);
  };

  const kakaoLogin = async (kakaoToken) => {
    const data = await businessAuthApi.kakaoLogin(kakaoToken);
    
    // 추가 정보가 필요한 경우
    if (data.needsAdditionalInfo) {
      return {
        needsAdditionalInfo: true,
        tempUserId: data.tempUserId,
      };
    }
    
    // 바로 로그인 가능한 경우
    localStorage.setItem("businessToken", data.token);
    setBusinessInfo(data.business);
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
