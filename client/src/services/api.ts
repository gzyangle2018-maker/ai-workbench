import axios from 'axios'
import { useAuthStore } from '../stores/auth'

// 生产环境: Worker API; 开发环境: Vite 代理
const API_BASE = import.meta.env.DEV ? '/api' : 'https://ai-workbench.gzyangle2018.workers.dev/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
