import { createContext, useContext, useReducer } from 'react'
import api from '../utils/api'

const HotelContext = createContext()

// 개발 모드 플래그
const DEV_MODE = import.meta.env.DEV

// Mock 호텔 데이터 (사업자당 1개)
const MOCK_HOTEL = {
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
}

const initialState = {
  hotel: null,
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
    case 'SET_HOTEL':
      return {
        ...state,
        hotel: action.payload,
        loading: false,
        error: null,
      }
    case 'UPDATE_HOTEL':
      return {
        ...state,
        hotel: action.payload,
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

  // Get my hotel (single hotel for this business owner)
  const getMyHotel = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 데이터 반환
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300))
        dispatch({ type: 'SET_HOTEL', payload: MOCK_HOTEL })
        return { success: true, data: MOCK_HOTEL }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.get('/hotels/my')
      dispatch({ type: 'SET_HOTEL', payload: response.data.data })
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch hotel'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // Update hotel
  const updateHotel = async (hotelData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 수정
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const updatedHotel = { ...state.hotel, ...hotelData }
        dispatch({ type: 'UPDATE_HOTEL', payload: updatedHotel })
        return { success: true, data: updatedHotel }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.put('/hotels/my', hotelData)
      dispatch({ type: 'UPDATE_HOTEL', payload: response.data.data })
      return { success: true, data: response.data.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update hotel'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    hotel: state.hotel,
    loading: state.loading,
    error: state.error,
    getMyHotel,
    updateHotel,
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
