import axios from 'axios'
import { getToken } from './authStorage.js'

const baseURL = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const httpClient = axios.create({
  baseURL,
  timeout: 10000,
})

httpClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default httpClient
