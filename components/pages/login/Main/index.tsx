'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { GoEye, GoEyeClosed } from 'react-icons/go'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'

import { authEndpoint } from '@/config/endpoints'
import { LOGIN_SCHEMA } from '@/helper/schemas'
import { useMutation } from '@/hooks/useMutation'
import { IUser } from '@/types'
import { actionLogin } from '@/redux/slices/auth'
import PageTitle from '@/components/common/PageTitle'
import { Role, MOCK_USERS } from '@/helper/enums'

export default function Login() {
  const loginMutation = useMutation<{ refresh: string; access: string; user: IUser }>()
  const dispatch = useDispatch()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  const defaultUser = MOCK_USERS[Role.ADMIN]

  const formik = useFormik({
    initialValues: { email: defaultUser.email, password: 'admin' },
    validationSchema: LOGIN_SCHEMA,
    onSubmit: async (values) => {
      try {
        // MOCK login
        let role: Role = Role.STUDENT
        if (values.email.includes('admin')) role = Role.ADMIN
        else if (values.email.includes('teacher')) role = Role.TEACHER

        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockResponse = {
          refresh: 'mock-refresh-token',
          access: 'mock-access-token',
          user: MOCK_USERS[role],
        }

        dispatch(actionLogin(mockResponse))

        if (mockResponse.user.role === Role.TEACHER) router.push('/class')
        else router.push('/')
      } catch {
        toast.error('Can not login')
      }
    },
  })

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <PageTitle title="Login" />
      <form className="flex flex-col gap-4 mt-3" onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          name="email"
          variant="underlined"
          errorMessage={formik.errors.email}
          isInvalid={formik.touched.email && !!formik.errors.email}
          onChange={formik.handleChange}
        />
        <Input
          label="Password"
          name="password"
          type={isVisible ? 'text' : 'password'}
          variant="underlined"
          errorMessage={formik.errors.password}
          isInvalid={formik.touched.password && !!formik.errors.password}
          onChange={formik.handleChange}
          endContent={
            <button type="button" onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? <GoEye /> : <GoEyeClosed />}
            </button>
          }
        />
        <Button
          className="w-full mt-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-white font-semibold"
          color="primary"
          isLoading={loginMutation.pending}
          size="lg"
          type="submit"
        >
          Login
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="mx-3 text-gray-500">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-3">
        <Button
          className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
          color="default"
          onClick={() => toast('Login with Google')}
        >
          <FcGoogle size={20} /> Login with Google
        </Button>

        <Button
          className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-blue-100"
          color="default"
          onClick={() => toast('Login with Facebook')}
        >
          <FaFacebookF size={18} color="#1877F2" /> Login with Facebook
        </Button>

        <Button
          className="text-sm text-gray-500 hover:underline"
          color="default"
          onClick={() => router.push('/register')}
          variant="flat"
        >
          Don't have an account? Register
        </Button>
      </div>
    </div>
  )
}
