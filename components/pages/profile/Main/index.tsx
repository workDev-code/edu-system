'use client'

import PageTitle from '@/components/common/PageTitle'
import { API_URL } from '@/config/constants'
import { authEndpoint } from '@/config/endpoints'
import { CHANGE_PASSWORD_SCHEMA } from '@/helper/schemas'
import { useMutation } from '@/hooks/useMutation'
import { RootState } from '@/redux'
import { Avatar } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { useFormik } from 'formik'
import moment from 'moment'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { GoEye, GoEyeClosed } from 'react-icons/go'

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [open, setOpen] = useState(false)

  // state toggle show/hide password
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const changePasswordMutation = useMutation()

  const formik = useFormik({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
    validationSchema: CHANGE_PASSWORD_SCHEMA,
    async onSubmit(values) {
      const { error } = await changePasswordMutation.mutation({
        method: 'post',
        url: authEndpoint.CHANGE_PASSWORD,
        body: values,
      })

      if (error) {
        toast.error(error.response?.data?.[0] || 'Can not change password')
        return
      }

      toast.success('Password changed')
      formik.resetForm()
      setOpen(false)
    },
  })

  return (
    <div>
      <PageTitle title="Profile" />
      <div className="max-w-screen-md mx-auto bg-white p-8 rounded-2xl shadow-md my-10">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center">
          <Avatar
            src={`${API_URL}${user?.avatar}`}
            name={user?.full_name}
            showFallback
            className="w-32 h-32 text-2xl rounded-full ring-2 ring-gray-200 shadow-md"
          />
          <p className="text-2xl uppercase font-semibold text-center mt-4">{user?.full_name}</p>
        </div>

        {/* User Info */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <InfoItem label="Code" value={user?.code} />
          <InfoItem label="Email" value={user?.email} />
          <InfoItem label="Phone" value={user?.phone_number || '-'} />
          <InfoItem label="Gender" value={user?.gender} />
          <InfoItem label="Address" value={user?.address || '-'} />
          <InfoItem label="DOB" value={moment(user?.date_of_birth).format('DD/MM/YYYY')} />
        </div>

        {/* Change password button */}
        <div className="flex justify-center mt-8">
          <Popover placement="top" showArrow backdrop="opaque" isOpen={open} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button color="primary" size="md" variant="shadow">
                Change Password
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="w-[360px] p-5 bg-white rounded-xl shadow-lg">
                <p className="text-center text-xl font-semibold text-gray-800 mb-6">Change Password</p>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
                  {/* Old password */}
                  <Input
                    name="old_password"
                    label="Old password"
                    variant="bordered"
                    type={showPassword.old ? 'text' : 'password'}
                    endContent={
                      <button
                        type="button"
                        className="focus:outline-none text-gray-500"
                        onClick={() => setShowPassword((prev) => ({ ...prev, old: !prev.old }))}
                      >
                        {showPassword.old ? <GoEyeClosed /> : <GoEye />}
                      </button>
                    }
                    isInvalid={formik.touched.old_password && !!formik.errors.old_password}
                    errorMessage={formik.errors.old_password}
                    onChange={formik.handleChange}
                  />

                  {/* New password */}
                  <Input
                    name="new_password"
                    label="New password"
                    variant="bordered"
                    type={showPassword.new ? 'text' : 'password'}
                    endContent={
                      <button
                        type="button"
                        className="focus:outline-none text-gray-500"
                        onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                      >
                        {showPassword.new ? <GoEyeClosed /> : <GoEye />}
                      </button>
                    }
                    isInvalid={formik.touched.new_password && !!formik.errors.new_password}
                    errorMessage={formik.errors.new_password}
                    onChange={formik.handleChange}
                  />

                  {/* Confirm password */}
                  <Input
                    name="confirm_new_password"
                    label="Confirm password"
                    variant="bordered"
                    type={showPassword.confirm ? 'text' : 'password'}
                    endContent={
                      <button
                        type="button"
                        className="focus:outline-none text-gray-500"
                        onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPassword.confirm ? <GoEyeClosed /> : <GoEye />}
                      </button>
                    }
                    isInvalid={formik.touched.confirm_new_password && !!formik.errors.confirm_new_password}
                    errorMessage={formik.errors.confirm_new_password}
                    onChange={formik.handleChange}
                  />

                  {/* Submit */}
                  <Button
                    color="primary"
                    size="lg"
                    radius="lg"
                    type="submit"
                    className="font-semibold tracking-wide transition-transform active:scale-95"
                    isLoading={changePasswordMutation.pending}
                  >
                    Confirm
                  </Button>
                </form>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex flex-col">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <span className="text-base font-medium">{value}</span>
    </p>
  )
}
