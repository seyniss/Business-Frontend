import { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

// 개발 모드 플래그 (환경변수 없이 테스트용)
const DEV_MODE = import.meta.env.DEV

// Mock 사용자 데이터
const MOCK_USER = {
  _id: 'mock-user-1',
  name: '테스트 사업자',
  email: 'test@business.com',
  phone: '010-1234-5678',
  businessName: '테스트 호텔',
  role: 'business',
}

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case 'AUTH_ERROR':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...initialState,
        loading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is authenticated on mount
  useEffect(() => {
    const loadUser = async () => {
      // 개발 모드: 자동으로 mock 사용자로 로그인
      if (DEV_MODE) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: MOCK_USER,
            token: 'mock-token-123',
          },
        })
        return
      }

      // 프로덕션 모드: 실제 API 호출
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await api.get('/auth/me')
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.data,
              token,
            },
          })
        } catch (error) {
          dispatch({
            type: 'AUTH_ERROR',
            payload: error.response?.data?.message || 'Authentication failed',
          })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadUser()
  }, [])

  // Login
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 로그인
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500)) // 네트워크 지연 시뮬레이션
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: MOCK_USER,
            token: 'mock-token-123',
          },
        })
        return { success: true }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.post('/auth/login', { email, password })
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.data.user,
          token: response.data.data.token,
        },
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  // Register
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // 개발 모드: Mock 회원가입
      if (DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newUser = { ...MOCK_USER, ...userData }
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: newUser,
            token: 'mock-token-123',
          },
        })
        return { success: true }
      }

      // 프로덕션 모드: 실제 API 호출
      const response = await api.post('/auth/register', userData)
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.data.user,
          token: response.data.data.token,
        },
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData)
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.data,
      })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Update failed',
      }
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
