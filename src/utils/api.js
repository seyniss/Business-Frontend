import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + import.meta.env.VITE_API_BASE_PATH || '/business/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          // Forbidden
          console.error('Access denied')
          break
        case 404:
          // Not found
          console.error('Resource not found')
          break
        case 500:
          // Server error
          console.error('Server error')
          break
        default:
          console.error('An error occurred:', error.response.data.message)
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - please check your connection')
    }
    return Promise.reject(error)
  }
)

export default api
