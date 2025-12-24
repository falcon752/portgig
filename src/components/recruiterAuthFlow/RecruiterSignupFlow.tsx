'use client'

import { RecruiterAuth } from '@/src/lib/requests/auth.new'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import LabelInput from '../ui/LabelInput'
import LabelTextarea from '../ui/LabelTextarea'
import {
  recruiterSignupSchema,
  type RecruiterSignupFormValues,
} from './validation'
import AppButton from '../ui/Button'
import { FcGoogle } from 'react-icons/fc'
import { handleGoogleAuth } from '@/service/googleAuth'

export default function RecruiterSignupForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const formik = useFormik<RecruiterSignupFormValues>({
    initialValues: {
      full_name: '',
      company_name: '',
      email: '',
      phone_number: '',
      industry: '',
      bio: '',
      password: '',
      confirm_password: '',
      acceptedTerms: false,
    },
    validationSchema: recruiterSignupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitError(null)
        const response = await RecruiterAuth.register({
          full_name: values.full_name,
          email: values.email,
          password: values.password,
          company_name: values.company_name,
          industry: values.industry,
          about_us: values.bio,
        })

        if (response.status === 201) {
          toast.success(response.message || 'Registration successful')
          localStorage.setItem('recruiterEmail', values.email)
          setTimeout(() => {
            router.push('/recruiter-email')
          }, 2500)
        } else {
          setSubmitError(response.message || 'Registration failed')
        }
      } catch (error) {
        console.error('Registration error:', error)
        setSubmitError('An error occurred during registration')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <main className='flex flex-col justify-start items-center gap-5 max-w-7xl px-5 lg:px-0'>
      <div className='w-full lg:w-4/5 flex flex-col gap-10 py-20'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-4xl font-semibold cursor-pointer'>Sign up</h1>
          <p className='text-base capitalize'>Welcome Recruiter, sign up</p>
        </div>

        <div className='w-full flex flex-col gap-5'>
          <h3 className='text-2xl'>Basic Information</h3>{' '}
          {submitError && (
            <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>
              {submitError}
            </div>
          )}
          <form
            onSubmit={formik.handleSubmit}
            className='flex flex-col gap-5 lg:gap-10 w-full'
          >
            <LabelInput
              label='full name'
              id='full_name'
              name='full_name'
              type='text'
              placeholder='Enter your full name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.full_name}
              error={
                formik.touched.full_name ? formik.errors.full_name : undefined
              }
              required
            />
            <LabelInput
              label='Company/Brand Name'
              id='company_name'
              name='company_name'
              type='text'
              placeholder='Enter your company/brand name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company_name}
              error={
                formik.touched.company_name
                  ? formik.errors.company_name
                  : undefined
              }
              required
            />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
              <LabelInput
                label='email address'
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email address'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email ? formik.errors.email : undefined}
                required
              />
              <LabelInput
                label='phone number'
                id='phone_number'
                name='phone_number'
                type='text'
                placeholder='Enter your phone number'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
                error={
                  formik.touched.phone_number
                    ? formik.errors.phone_number
                    : undefined
                }
                required
              />
            </div>

            <LabelInput
              label='industry/Niche'
              id='industry'
              name='industry'
              type='text'
              placeholder='Enter your industry or niche'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.industry}
              error={
                formik.touched.industry ? formik.errors.industry : undefined
              }
              required
            />

            <LabelTextarea
              id='bio'
              label='Company Bio'
              name='bio'
              placeholder='Tell us about your company'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              error={formik.touched.bio ? formik.errors.bio : undefined}
              required
            />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
              <LabelInput
                label='password'
                id='password'
                name='password'
                type='password'
                placeholder='Enter your password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={
                  formik.touched.password ? formik.errors.password : undefined
                }
                required
              />
              <LabelInput
                label='confirm password'
                id='confirm_password'
                name='confirm_password'
                type='password'
                placeholder='Confirm your password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm_password}
                error={
                  formik.touched.confirm_password
                    ? formik.errors.confirm_password
                    : undefined
                }
                required
              />
            </div>

            <div className='flex items-center space-x-2 text-white'>
              <input
                type='checkbox'
                id='acceptedTerms'
                name='acceptedTerms'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.acceptedTerms}
                className='w-4 h-4 text-secondary focus:ring-white rounded shrink-0'
              />
              <label htmlFor='acceptedTerms' className='text-sm'>
                By signing up, you agree to receive emails about updates, job
                offers, and more from PortGig.
              </label>
            </div>
            {formik.touched.acceptedTerms && formik.errors.acceptedTerms && (
              <p className='text-red-500 text-sm'>
                {formik.errors.acceptedTerms}
              </p>
            )}

            <button
              type='submit'
              className='border border-gray-400 text-white py-3 px-6 rounded-lg hover:bg-white hover:text-black 
              transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>

            {/* <AppButton
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleGoogleAuth('Recruiter')}
              disabled={formik.isSubmitting}>
              {'Sign in with Google'}
              <FcGoogle size={24} />
            </AppButton> */}
          </form>
        </div>
      </div>
    </main>
  )
}
