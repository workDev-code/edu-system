import axios from 'axios'

import { store } from '@/redux'
import { ACCESS_TOKEN, API_URL, REFRESH_TOKEN } from '@/config/constants'
import { actionLogout } from '@/redux/slices/auth'
import { authEndpoint } from '@/config/endpoints'
import { getClientCookie, setClientCookie } from './clientCookies'

// Tạo một instance của axios để dùng chung trong toàn bộ project
const axiosInstance = axios.create({
  // baseURL: URL gốc cho tất cả request.
  // Khi gọi axiosInstance.get('/users'), thực chất sẽ là `${API_URL}/api/users`
  baseURL: `${API_URL}/api`,
  // timeout: thời gian tối đa (ms) cho một request trước khi nó bị hủy.
  // 60000ms = 60 giây
  timeout: 60000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getClientCookie(ACCESS_TOKEN)
    config.headers.Authorization = `Bearer ${accessToken}`

    return config
  },
  (error) => error,
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error

    if (response.status === 401 && config.url !== authEndpoint.REFRESH) {
      const refreshToken = getClientCookie(REFRESH_TOKEN)

      if (!refreshToken) {
        store.dispatch(actionLogout())

        return Promise.reject(error)
      }

      return axiosInstance
        .post(authEndpoint.REFRESH, {
          refresh: refreshToken,
        })
        .then((res: Record<string, any>) => {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res?.data?.access}`
          config.headers['Authorization'] = `Bearer ${res?.data?.access}`
          setClientCookie(ACCESS_TOKEN, res?.data.access)

          return axiosInstance(config)
        })
        .catch(() => {
          store.dispatch(actionLogout())

          return Promise.reject(error)
        })
    }

    return Promise.reject(error)
  },
)

export { axiosInstance }
