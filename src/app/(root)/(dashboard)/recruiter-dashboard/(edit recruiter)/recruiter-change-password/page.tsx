'use client'

import { RecruiterAuth } from '@/src/lib/requests/auth.new'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface PasswordFormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const PasswordReset = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordFormData>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPassword = watch('newPassword')

  const onSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const payload = {
      old_password: data.oldPassword,
      new_password: data.newPassword,
    }

    try {
      const response = await RecruiterAuth.changePassword(payload)

      if (response.status === 200) {
        toast.success(response.message || 'Password reset successfully')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.error(response.message || 'Failed to reset password')
      }
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Failed to update profile')
    }
  }

  return (
    <div className='lg:min-h-screen bg-gray-100 flex items-start lg:items-center justify-center'>
      <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-3xl font-semibold text-[#0A1754] text-center mb-2'>
          Password Reset
        </h2>
        <p className='text-[#1E3A8A] text-center mb-6'>
          Enter your new password
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4'>
            <label
              className='block text-[#0A1754] text-sm font-medium mb-2'
              htmlFor='oldPassword'
            >
              Old Password
            </label>
            <input
              type='password'
              id='oldPassword'
              className={`w-full p-2 border ${
                errors.oldPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-gray-200 text-gray-700 focus:outline-none`}
              {...register('oldPassword', {
                required: 'Old password is required',
              })}
            />
            {errors.oldPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.oldPassword.message}
              </p>
            )}
          </div>
          <div className='mb-4'>
            <label
              className='block text-[#0A1754] text-sm font-medium mb-2'
              htmlFor='newPassword'
            >
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              className={`w-full p-2 border ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-gray-200 text-gray-700 focus:outline-none`}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            {errors.newPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className='mb-6'>
            <label
              className='block text-[#0A1754] text-sm font-medium mb-2'
              htmlFor='confirmPassword'
            >
              Confirm New Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              className={`w-full p-2 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md bg-gray-200 text-gray-700 focus:outline-none`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === newPassword || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type='submit'
            className='w-full bg-[#0A1754] text-white p-2 rounded-md hover:bg-[#0A1751] transition cursor-pointer'
          >
            Change my password
          </button>
        </form>
      </div>
    </div>
  )
}

export default PasswordReset
