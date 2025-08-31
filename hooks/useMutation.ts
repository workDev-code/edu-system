import { useState } from 'react'
import { AxiosRequestConfig } from 'axios'
import { axiosInstance } from '@/services/axiosInstance'
import { Role, MOCK_USERS } from '../helper/enums'

export const useMutation = <T = unknown>() => {
  const [pending, setPending] = useState(false)

  return {
    pending,
    mutation: async ({
      url,
      config,
      body,
      method,
    }: {
      url: string
      method: 'post' | 'put' | 'patch' | 'delete'
      body?: any
      config?: AxiosRequestConfig
    }): Promise<{
      response: T | null
      error: null | any
    }> => {
      try {
        setPending(true)
        // Mock login
        if (url === '/auth/login' && method === 'post') {
          // Chọn role từ body.role nếu bạn muốn test nhiều role
          const role = Role.ADMIN
          const mockUser = MOCK_USERS[role]

          // Mô phỏng delay
          await new Promise((resolve) => setTimeout(resolve, 500))

          return { response: mockUser as any, error: null }
        }
        const response = await axiosInstance({
          url,
          method,
          ...config,
          data: body,
        })

        return {
          response: response.data,
          error: null,
        }
      } catch (error) {
        return {
          response: null,
          error,
        }
      } finally {
        setPending(false)
      }
    },
  }
}
