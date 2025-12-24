'use client'
import { CreatorAuth } from '@/src/lib/requests/auth.new'
import { setSelectedField } from '@/src/redux/features/authSlice'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks'
import { Field, industryOptions } from '@/src/utils/industryData'
import NaijaStates from 'naija-state-local-government'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LabelInput from '../ui/LabelInput'
import LabelSelect from '../ui/LabelSelect'
import { formatPhoneNumber } from '@/src/utils/data'
import { validationSchema } from '@/src/schema/auth-schema'
import { experienceOptions } from '@/src/constants'
import AppButton from '../ui/Button'
import { FcGoogle } from 'react-icons/fc'
import { handleGoogleAuth } from '@/service/googleAuth'
import Cookies from "universal-cookie";

const cookiestore = new Cookies();

export default function CreativeSignupForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { selectedField, loading: loadingLgas } = useAppSelector((state) => state.auth)

  const formik = useFormik({
    initialValues: {
      full_name: '',
      user_name: '',
      email: '',
      phoneNumber: '',
      field: '',
      industry: '',
      years_of_experience: '',
      state: '',
      lga: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitError(null)
        const formattedPhone = formatPhoneNumber(values.phoneNumber)
        const registrationData = {
          full_name: values.full_name.trim(),
          user_name: values.user_name.toLowerCase().trim(),
          email: values.email.toLowerCase().trim(),
          phone_number: formattedPhone,
          password: values.password,
          field: values.field,
          industry: values.industry,
          years_of_experience: values.years_of_experience,
          state: values.state,
          lga: values.lga,
        }

        const response = await CreatorAuth.register(registrationData);
        if (response.status === 201) {
          cookiestore.set("userEmail", registrationData.email, { path: "/" });
          localStorage.setItem("userEmail", registrationData.email);

          toast.success(response.message || 'Registration successful!');
          setTimeout(() => router.push(`/creative-email?email=${encodeURIComponent(registrationData.email)}`), 2500);
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  })

  useEffect(() => {
    formik.setFieldValue('lga', '')
  }, [formik.values.state])

  const states = Array.isArray(NaijaStates.states()) ? NaijaStates.states() : []
  
  const getLgas = (stateName: string) => {
    try {
      const result = NaijaStates.lgas(stateName)
      return result && result.lgas && Array.isArray(result.lgas) ? result.lgas : []
    } catch (error) {
      console.error('Error getting LGAs for state:', stateName, error)
      return []
    }
  }

  const lgas = formik.values.state ? getLgas(formik.values.state) : []
  
  const lgaOptions = lgas.map((lga: string) => ({ label: lga, value: lga }))
  const stateOptions = states.map((state: string) => ({ label: state, value: state }))
  const fields = Object.keys(industryOptions).map((field) => ({ label: field, value: field }))
  const industries = selectedField ? industryOptions[selectedField as Field].map((industry: string) => ({ label: industry, value: industry })) : []

  return (
    <main className='flex flex-col items-center gap-5 max-w-7xl'>
      <div className='w-full lg:w-4/5 flex flex-col gap-10 py-20'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-4xl font-inter font-normal'>Sign up</h1>
          <p className='text-xl font-raleway'>Welcome Creatives, sign up</p>
        </div>

        <div className='w-full flex flex-col gap-5'>
          <h3 className='text-2xl'>Basic Information</h3>
          {submitError && <div className='p-3 text-sm text-red-500 bg-red-50 rounded-md'>{submitError}</div>}

          <form onSubmit={formik.handleSubmit} className='flex flex-col gap-10 w-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-10'>
              <LabelInput
                label='Full Name'
                id='full_name'
                name='full_name'
                type='text'
                placeholder='Enter your full name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.full_name}
                error={formik.touched.full_name ? formik.errors.full_name : undefined}
                required
              />
              <LabelInput
                label='Username'
                id='user_name'
                name='user_name'
                type='text'
                placeholder='Enter your username'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.user_name}
                error={formik.touched.user_name ? formik.errors.user_name : undefined}
                required
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-10'>
              <LabelInput
                label='Email Address'
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email ? formik.errors.email : undefined}
                required
              />
              <LabelInput
                label='Phone Number'
                id='phoneNumber'
                name='phoneNumber'
                type='tel'
                placeholder='e.g. 08012345678'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phoneNumber}
                error={formik.touched.phoneNumber ? formik.errors.phoneNumber : undefined}
                required
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-10'>
              <LabelSelect
                label='Field'
                id='field'
                name='field'
                options={fields}
                value={formik.values.field}
                onChange={(e) => {
                  formik.setFieldValue('field', e.target.value)
                  dispatch(setSelectedField(e.target.value))
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.field ? formik.errors.field : undefined}
              />
              <LabelSelect
                label='Industry'
                id='industry'
                name='industry'
                options={industries}
                value={formik.values.industry}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.industry ? formik.errors.industry : undefined}
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-10'>
              <LabelSelect
                label='Experience Level'
                id='years_of_experience'
                name='years_of_experience'
                options={experienceOptions}
                value={formik.values.years_of_experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.years_of_experience ? formik.errors.years_of_experience : undefined}
              />
              <LabelSelect
                label='State'
                id='state'
                name='state'
                options={stateOptions}
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state ? formik.errors.state : undefined}
              />
            </div>

            <div className='w-full'>
              <LabelSelect
                label='LGA'
                id='lga'
                name='lga'
                options={lgaOptions}
                value={formik.values.lga}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lga ? formik.errors.lga : undefined}
                required
                loading={loadingLgas}
              />
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-10'>
              <LabelInput
                label='Password'
                id='password'
                name='password'
                type='password'
                placeholder='Enter a strong password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password ? formik.errors.password : undefined}
                required
              />
              <LabelInput
                label='Confirm Password'
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Re-enter password'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                error={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
                required
              />
            </div>

            <div className='flex items-center gap-3'>
              <input
                type='checkbox'
                id='acceptedTerms'
                name='acceptedTerms'
                onChange={formik.handleChange}
                checked={formik.values.acceptedTerms}
                className='w-5 h-5 text-green-600 border-gray-300 rounded'
              />
              <label htmlFor='acceptedTerms' className='text-sm'>I agree to the terms and conditions</label>
            </div>
            {formik.touched.acceptedTerms && formik.errors.acceptedTerms && (
              <p className='text-sm text-red-500'>{formik.errors.acceptedTerms}</p>
            )}

            <button
              type='submit'
              disabled={formik.isSubmitting || !formik.isValid}
              className='border border-gray-400 text-white py-3 px-6 rounded-lg hover:bg-white hover:text-black 
              transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>

            {/* <AppButton
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleGoogleAuth('Creator')}
              disabled={formik.isSubmitting}
            >
              {'Sign in with Google'}
              <FcGoogle size={24} />
            </AppButton> */}
          </form>
        </div>
      </div>
    </main>
  )
}