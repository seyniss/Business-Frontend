import { createContext, useContext, useReducer } from 'react'
import api from '../utils/api'

const HotelContext = createContext()

// 개발 모드 플래그
const DEV_MODE = import.meta.env.DEV

// Mock 호텔 데이터
const MOCK_HOTELS = [
  {
    _id: 'hotel-1',
    name: '그랜드 서울 호텔',
    description: '서울 중심부에 위치한 럭셔리 비즈니스 호텔입니다. 최고급 서비스와 편의시설을 제공합니다.',
    address: '서울시 강남구 테헤란로 123',
    city: '서울',
    country: 'South Korea',
    phone: '02-1234-5678',
    email: 'info@grandseoul.com',
    website: 'https://grandseoul.com',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    roomCount: 20,
    reviewCount: 45,
  },
  {
    _id: 'hotel-2',
    name: '제주 오션 리조트',
    description: '제주도 해변가에 위치한 프리미엄 리조트입니다. 아름다운 바다 전망과 함께하는 힐링 여행.',
    address: '제주특별자치도 서귀포시 해안로 456',
    city: '제주',
    country: 'South Korea',
    phone: '064-789-0123',
    email: 'info@jejuocean.com',
    website: 'https://jejuocean.com',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
    roomCount: 15,
    reviewCount: 32,
  },
  {
    _id: 'hotel-3',
    name: '부산 비치 호텔',
    description: '해운대 해변 바로 앞에 위치한 모던한 호텔입니다. 완벽한 휴가를 위한 최상의 선택.',
    address: '부산광역시 해운대구 해변로 789',
    city: '부산',
    country: 'South Korea',
    phone: '051-456-7890',
    email: 'info@busanbeach.com',
    website: 'https://busanbeach.com',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'],
    roomCount: 10,
    reviewCount: 28,
  },
]

const initialState = {
  hotels: [],
  currentHotel: null,
  loading: false,
  error: null,
}

const hotelReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'SET_HOTELS':
      return {
        ...state,
        hotels: action.payload,
        loading: false,
        error: null,
      }
    case 'SET_CURRENT_HOTEL':
      return {
        ...state,
        currentHotel: action.payload,
        loading: false,
        error: null,
      }
    case 'ADD_HOTEL':
      return {
        ...state,
        hotels: [action.payload, ...state.hotels],
        loading: false,
        error: null,
      }
    case 'UPDATE_HOTEL':
      return {
        ...state,
        hotels: state.hotels.map((hotel) =>
          hotel._id === action.payload._id ? action.payload : hotel
        ),
        currentHotel:
          state.currentHotel?._id === action.payload._id
            ? action.payload
            : state.currentHotel,
        loading: false,
        error: null,
      }
    case 'DELETE_HOTEL':
      return {
        ...state,
        hotels: state.hotels.filter((hotel) => hotel._id !== action.payload),
        currentHotel:
          state.currentHotel?._id === action.payload ? null : state.currentHotel,
        loading: false,
        error: null,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const HotelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hotelReducer, initialState)

  // Get all hotels for business owner
  const getHotels = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 데이터 반환
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300))
        dispatch({ type: 'SET_HOTELS', payload: MOCK_HOTELS })
        return { success: true, data: MOCK_HOTELS }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.get('/hotels')
      dispatch({ type: 'SET_HOTELS', payload: response.data.data })
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch hotels'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // Get single hotel
  const getHotel = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 데이터 반환
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const hotel = MOCK_HOTELS.find(h => h._id === id)
        if (hotel) {
          dispatch({ type: 'SET_CURRENT_HOTEL', payload: hotel })
          return { success: true, data: hotel }
        }
        dispatch({ type: 'SET_ERROR', payload: 'Hotel not found' })
        return { success: false, error: 'Hotel not found' }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.get(`/hotels/${id}`)
      dispatch({ type: 'SET_CURRENT_HOTEL', payload: response.data.data })
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch hotel'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // Create hotel
  const createHotel = async (hotelData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 생성
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newHotel = {
          _id: `hotel-${Date.now()}`,
          ...hotelData,
          roomCount: 0,
          reviewCount: 0,
          images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'],
        }
        dispatch({ type: 'ADD_HOTEL', payload: newHotel })
        return { success: true, data: newHotel }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.post('/hotels', hotelData)
      dispatch({ type: 'ADD_HOTEL', payload: response.data.data })
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create hotel'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // Update hotel
  const updateHotel = async (id, hotelData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 수정
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const updatedHotel = { _id: id, ...hotelData }
        dispatch({ type: 'UPDATE_HOTEL', payload: updatedHotel })
        return { success: true, data: updatedHotel }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.put(`/hotels/${id}`, hotelData)
      dispatch({ type: 'UPDATE_HOTEL', payload: response.data.data })
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update hotel'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // Delete hotel
  const deleteHotel = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 삭제
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300))
        dispatch({ type: 'DELETE_HOTEL', payload: id })
        return { success: true }
      }

      // 프로덕션 모드: 실제 API 호출
      await api.delete(`/hotels/${id}`)
      dispatch({ type: 'DELETE_HOTEL', payload: id })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete hotel'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // Clear current hotel
  const clearCurrentHotel = () => {
    dispatch({ type: 'SET_CURRENT_HOTEL', payload: null })
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    hotels: state.hotels,
    currentHotel: state.currentHotel,
    loading: state.loading,
    error: state.error,
    getHotels,
    getHotel,
    createHotel,
    updateHotel,
    deleteHotel,
    clearCurrentHotel,
    clearError,
  }

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
}

export const useHotel = () => {
  const context = useContext(HotelContext)
  if (!context) {
    throw new Error('useHotel must be used within HotelProvider')
  }
  return context
}
