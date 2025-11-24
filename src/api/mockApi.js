import {
  mockBusinessUser,
  mockHotel,
  mockRooms,
  mockBookings,
  mockReviews,
  mockStats,
} from "./mockData";

// API 지연 시뮬레이션
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API 응답 생성
const createResponse = (data) => {
  return Promise.resolve(data);
};

// 회원가입한 사용자 정보 저장소 (localStorage 사용)
const getRegisteredUsers = () => {
  const stored = localStorage.getItem("mockRegisteredUsers");
  return stored ? JSON.parse(stored) : [];
};

const saveRegisteredUser = (userData) => {
  const users = getRegisteredUsers();
  const existingUser = users.find((u) => u.email === userData.email);
  if (existingUser) {
    // 이미 존재하는 사용자면 업데이트
    Object.assign(existingUser, userData);
  } else {
    // 새 사용자 추가
    users.push(userData);
  }
  localStorage.setItem("mockRegisteredUsers", JSON.stringify(users));
};

const findRegisteredUser = (email, password) => {
  const users = getRegisteredUsers();
  return users.find((u) => u.email === email && u.password === password);
};

// Mock 인증 API
export const mockAuthApi = {
  login: async (credentials) => {
    await delay();

    // 기본 테스트 계정
    if (
      credentials.email === "1234@1234.com" &&
      credentials.password === "1234"
    ) {
      const businessInfo = mockBusinessUser;
      localStorage.setItem("mockCurrentUser", JSON.stringify(businessInfo));
      return createResponse({
        token: "mock-jwt-token-" + Date.now(),
        business: businessInfo,
      });
    }

    // 회원가입한 사용자 확인
    const registeredUser = findRegisteredUser(credentials.email, credentials.password);
    if (registeredUser) {
      const { password, ...userWithoutPassword } = registeredUser;
      const businessInfo = {
        id: registeredUser.id || "business-" + Date.now(),
        name: registeredUser.name || registeredUser.email.split("@")[0],
        email: registeredUser.email,
        phone: registeredUser.phone,
        businessNumber: registeredUser.businessNumber,
        createdAt: registeredUser.createdAt || new Date().toISOString(),
      };
      localStorage.setItem("mockCurrentUser", JSON.stringify(businessInfo));
      return createResponse({
        token: "mock-jwt-token-" + Date.now(),
        business: businessInfo,
      });
    }

    throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem("mockCurrentUser");
    return createResponse({ message: "Logged out successfully" });
  },

  getMyInfo: async () => {
    await delay();
    // localStorage에서 현재 사용자 정보 가져오기
    const currentUser = localStorage.getItem("mockCurrentUser");
    if (currentUser) {
      return createResponse(JSON.parse(currentUser));
    }
    // 없으면 기본 mock 사용자 반환
    return createResponse(mockBusinessUser);
  },

  changePassword: async (data) => {
    await delay();
    return createResponse({ message: "Password changed successfully" });
  },

  forgotPassword: async (email) => {
    await delay();
    return createResponse({ message: "Reset email sent" });
  },

  signup: async (data) => {
    await delay();

    // 이미 등록된 이메일인지 확인
    const users = getRegisteredUsers();
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("이미 등록된 이메일입니다.");
    }

    // 회원가입 정보 저장 (비밀번호 포함)
    const userData = {
      id: "business-" + Date.now(),
      name: data.name || data.email.split("@")[0],
      email: data.email,
      password: data.password, // 로그인 시 확인용으로 저장
      phone: data.phone,
      businessNumber: data.businessNumber,
      createdAt: new Date().toISOString(),
    };

    saveRegisteredUser(userData);

    // 비밀번호 제외하고 반환
    const { password, ...userWithoutPassword } = userData;
    localStorage.setItem("mockCurrentUser", JSON.stringify(userWithoutPassword));
    return createResponse({
      token: "mock-jwt-token-" + Date.now(),
      business: userWithoutPassword,
    });
  },

  updateProfile: async (data) => {
    await delay();
    return createResponse({ ...mockBusinessUser, ...data });
  },
};

// Mock 호텔 API
export const mockHotelApi = {
  getMyHotel: async () => {
    await delay();
    return createResponse(mockHotel);
  },

  updateHotel: async (data) => {
    await delay();
    return createResponse({ ...mockHotel, ...data });
  },
};

// Mock 객실 API
export const mockRoomApi = {
  getRooms: async () => {
    await delay();
    return createResponse(mockRooms);
  },

  getRoomById: async (roomId) => {
    await delay();
    const room = mockRooms.find((r) => r.id === roomId);
    return createResponse(room);
  },

  createRoom: async (data) => {
    await delay();
    const newRoom = {
      id: "room-" + Date.now(),
      ...data,
    };
    return createResponse(newRoom);
  },

  create: async (data) => {
    await delay();
    const newRoom = {
      id: "room-" + Date.now(),
      ...data,
    };
    return createResponse(newRoom);
  },

  updateRoom: async (roomId, data) => {
    await delay();
    return createResponse({ id: roomId, ...data });
  },

  update: async (roomId, data) => {
    await delay();
    return createResponse({ id: roomId, ...data });
  },

  deleteRoom: async (roomId) => {
    await delay();
    return createResponse({ message: "Room deleted" });
  },

  delete: async (roomId) => {
    await delay();
    return createResponse({ message: "Room deleted" });
  },

  updateStatus: async (roomId, status) => {
    await delay();
    return createResponse({ id: roomId, status });
  },
};

// Mock 예약 API
export const mockBookingApi = {
  getBookings: async (params = {}) => {
    await delay();
    let filtered = [...mockBookings];

    if (params.status) {
      filtered = filtered.filter((booking) => booking.status === params.status);
    }

    if (params.search) {
      const keyword = params.search.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id.toLowerCase().includes(keyword) ||
          booking.guestName.toLowerCase().includes(keyword) ||
          booking.hotelName?.toLowerCase().includes(keyword)
      );
    }

    if (params.startDate) {
      filtered = filtered.filter((booking) => booking.checkIn >= params.startDate);
    }

    if (params.endDate) {
      filtered = filtered.filter((booking) => booking.checkOut <= params.endDate);
    }

    const page = Number(params.page) || 1;
    const pageSize = Number(params.pageSize) || 10;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const startIndex = (page - 1) * pageSize;

    return createResponse({
      bookings: filtered.slice(startIndex, startIndex + pageSize),
      totalPages,
      currentPage: page,
    });
  },

  getBookingById: async (bookingId) => {
    await delay();
    const booking = mockBookings.find((b) => b.id === bookingId);
    return createResponse(booking);
  },

  updateBookingStatus: async (bookingId, status) => {
    await delay();
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = status;
    }
    return createResponse({ id: bookingId, status });
  },

  cancelBooking: async (bookingId, reason) => {
    await delay();
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.status = "cancelled";
      booking.cancelReason = reason || "관리자 취소";
    }
    return createResponse({ message: "Booking cancelled" });
  },
};

// Mock 리뷰 API
export const mockReviewApi = {
  getReviews: async (params = {}) => {
    await delay();
    return createResponse({
      reviews: mockReviews,
      totalPages: 1,
      currentPage: 1,
    });
  },

  getReviewById: async (reviewId) => {
    await delay();
    const review = mockReviews.find((r) => r.id === reviewId);
    return createResponse(review);
  },

  replyToReview: async (reviewId, reply) => {
    await delay();
    return createResponse({ message: "Reply added" });
  },

  reply: async (reviewId, reply) => {
    await delay();
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.reply = reply;
    }
    return createResponse({ message: "Reply added" });
  },

  reportReview: async (reviewId, reason) => {
    await delay();
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.status = "reported";
      review.reportReason = reason;
    }
    return createResponse({ message: "Review reported" });
  },

  report: async (reviewId, reason) => {
    await delay();
    const review = mockReviews.find((r) => r.id === reviewId);
    if (review) {
      review.status = "reported";
      review.reportReason = reason;
    }
    return createResponse({ message: "Review reported" });
  },

  getStats: async () => {
    await delay();
    return createResponse({
      totalReviews: mockReviews.length,
      averageRating: 3.7,
      ratingDistribution: { 5: 1, 4: 1, 3: 0, 2: 1, 1: 0 },
    });
  },
};

// Mock 통계 API
export const mockStatsApi = {
  getDashboardStats: async () => {
    await delay();
    return createResponse({
      hotel: mockHotel,
      recentBookings: mockBookings,
      chartData: {
        labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
        revenue: [2000000, 2500000, 2200000, 2800000, 3000000, 3200000],
        bookings: [45, 58, 52, 67, 72, 78],
      },
    });
  },

  getStats: async () => {
    await delay();
    return createResponse(mockStats);
  },

  getStatistics: async (params = {}) => {
    await delay();
    return createResponse(mockStats);
  },

  getRevenueStats: async (period) => {
    await delay();
    return createResponse(getRevenueTrend(period || "month"));
  },

  getBookingStats: async (period) => {
    await delay();
    return createResponse({
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      data: [45, 58, 52, 67, 72, 78],
    });
  },

  getOccupancyStats: async (period) => {
    await delay();
    return createResponse({
      labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
      data: [65, 72, 68, 78, 82, 85],
    });
  },
};

const revenueTrendDatasets = {
  week: {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    revenue: [5200000, 6100000, 5800000, 6400000, 7200000, 7800000, 6900000],
    bookings: [65, 72, 68, 75, 88, 92, 81],
  },
  month: {
    labels: ["1주차", "2주차", "3주차", "4주차"],
    revenue: [14500000, 16800000, 18900000, 21000000],
    bookings: [180, 195, 210, 230],
  },
  quarter: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    revenue: [70000000, 88000000, 92000000, 86000000],
    bookings: [520, 610, 640, 590],
  },
  year: {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    revenue: [32000000, 28000000, 26000000, 31000000, 34000000, 36000000, 38000000, 42000000, 40000000, 39000000, 37000000, 41000000],
    bookings: [78, 72, 70, 80, 85, 88, 90, 95, 92, 89, 85, 91],
  },
};

const getRevenueTrend = (period) => {
  return (
    revenueTrendDatasets[period] || revenueTrendDatasets.month || {
      labels: [],
      revenue: [],
      bookings: [],
    }
  );
};
