'use client'
import { LooadingSpinner } from '@/src/utils/util_component'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { FcGoogle } from "react-icons/fc";
import {
  creatorSignin,
  creatorSignUp,
  recruiterSignin,
  recruiterSignUp,
} from '../../utils/authActions'
import { industryOptions } from '../../utils/industryData'
import AuthButton from './AuthButton'
import {
  recruiterSignInSchema,
  recruiterSignUpSchema,
  signInSchema,
  signUpSchema,
} from './zodSchemas'

interface FormData {
  fullName?: string
  username: string
  phoneNumber: string
  email: string
  password: string
  field: string
  industry: string
  yearOfExperience: string
  location: string
  localGov: string
  bio: string
  confirmPassword: string
  acceptedTerms: boolean
}

// type signInData = z.infer<typeof signInSchema>;
// type signUpData = z.infer<typeof signUpSchema>;

interface AuthFormProps {
  type: 'sign-in' | 'sign-up' | 'recruiter-sign-in' | 'recruiter-sign-up'
}

const AuthForm = ({ type }: AuthFormProps) => {
  const navigate = useRouter()

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
    field: '',
    industry: '',
    yearOfExperience: '',
    location: '',
    localGov: '',
    bio: '',
    confirmPassword: '',
    acceptedTerms: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field on change
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }
  const [isLoading, setIsLoading] = useState(false)
  //handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const schema =
      type === 'sign-in'
        ? signInSchema
        : type === 'sign-up'
        ? signUpSchema
        : type === 'recruiter-sign-in'
        ? recruiterSignInSchema
        : recruiterSignUpSchema

    // Validate form data
    const result = schema.safeParse(formData)
    console.log(result)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    } else {
      // Login or sign up logic

      try {
        setIsLoading(true)
        if (isSignin) {
          await creatorSignin(formData)
          navigate.push('/creative-homepage')
        } else if (isSignup) {
          const res = await creatorSignUp(formData)
          navigate.push('/creative-email')
          console.log(res)
        } else if (isRecruiterSignin) {
          await recruiterSignin(formData)
          navigate.push('/recruiter-homepage')
        } else if (isRecruiterSignup) {
          await recruiterSignUp(formData)
          navigate.push('/recruiter-email')
        }
        setIsLoading(false)

        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          username: '',
          password: '',
          field: '',
          industry: '',
          yearOfExperience: '',
          location: '',
          localGov: '',
          confirmPassword: '',
          bio: '',
          acceptedTerms: false,
        })
        setErrors({})
      } catch (err) {
        // Optional: handle or show the error to the user
        setIsLoading(false)
        console.error('Authentication error:', err)
      }
    }
  }

  const isSignin = type === 'sign-in'
  const isRecruiterSignin = type === 'recruiter-sign-in'
  const isSignup = type === 'sign-up'
  const isRecruiterSignup = type === 'recruiter-sign-up'
  const labelStyles = 'block max-lg:text-sm text-lg font-bold font-raleway'
  const inputStyles =
    'text-secondary mt-2 w-full max-sm:py-2 py-3 px-10 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary font-raleway'
  return (
    <form
      onSubmit={handleSubmit}
      className='px-5 md:px-30 lg:px-10 xl:px-20 2xl:px-30 space-y-7 flex flex-col font-raleway'
    >
      <div className='max-lg:block lg:hidden self-center w-fit cursor-pointer '>
        {/* Logo */}
        <Link href='/'>
          {' '}
          <Image
            src='/assets/portgig-2.svg'
            alt='Portgig Logo'
            width={150} // Fixed width
            height={150} // Fixed height
          />
        </Link>
      </div>
      {/* page label */}
      <div className='space-y-4'>
        {(isSignin || isRecruiterSignin) && (
          <p className=' max-lg:text-xl text-3xl font-inter'>Sign in</p>
        )}
        {(isSignup || isRecruiterSignup) && (
          <p className=' max-lg:text-xl text-3xl font-inter'>Sign up</p>
        )}

        {isSignin && (
          <p className=' text-lg font-raleway '>Welcome Creative, sign in</p>
        )}
        {isSignup && (
          <p className=' text-lg font-raleway '>Welcome creative, sign up</p>
        )}
        {isRecruiterSignin && (
          <p className=' text-lg '>Welcome Recruiter, sign in</p>
        )}
        {isRecruiterSignup && (
          <p className=' text-lg '>Welcome Recruiter, sign up</p>
        )}
      </div>
      {(isSignup || isRecruiterSignup) && (
        <div className='flex flex-wrap gap-4 text-white'>
          {/* Fullname field */}
          <div className='flex-1 min-w-[200px]'>
            <label htmlFor='name' className={`${labelStyles}`}>
              Full name
            </label>
            <input
              type='text'
              id='name'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              className={`${inputStyles}`}
              placeholder='Enter your full name'
              required
            />
            {errors.fullName && (
              <p className='text-red-500 text-sm mt-3'>{errors.fullName}</p>
            )}
          </div>

          {/* Username field */}
          <div className='flex-1 min-w-[200px]'>
            <label htmlFor='username' className={`${labelStyles}`}>
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className={`${inputStyles}`}
              placeholder='Enter your username'
              required
            />
            {errors.username && (
              <p className='text-red-500 text-sm mt-3'>{errors.username}</p>
            )}
          </div>
        </div>
      )}

      <div className='flex flex-col lg:flex-row gap-4 w-full'>
        {/* Email */}
        <div
          className={`text-white ${isSignin ? 'w-full' : 'w-full lg:w-1/2'}`}
        >
          <label htmlFor='email' className={`${labelStyles} w-full`}>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className={`${inputStyles} w-full`}
            placeholder='Enter your email address'
            required
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-3'>{errors.email}</p>
          )}
        </div>

        {/* Phone field for sign ups */}
        {(isSignup || isRecruiterSignup) && (
          <div className='text-white w-full lg:w-1/2'>
            <label htmlFor='phoneNumber' className={`${labelStyles}`}>
              Phone number
            </label>
            <input
              type='number'
              id='phoneNumber'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`appearance-none ${inputStyles}`}
              placeholder='Enter your phone number'
              required
            />
            {errors.phoneNumber && (
              <p className='text-red-500 text-sm mt-3'>{errors.phoneNumber}</p>
            )}
          </div>
        )}
      </div>

      {(isSignup || isRecruiterSignup) && (
        <div className='flex flex-wrap gap-4 text-white'>
          {/* Field Dropdown */}
          <div className='flex-1 min-w-[200px] relative'>
            <label htmlFor='field' className={`${labelStyles}`}>
              Field
            </label>
            <select
              id='field'
              name='field'
              value={formData.field}
              onChange={(e) => {
                handleChange(e)
                setFormData((prev) => ({
                  ...prev,
                  industry: '',
                }))
              }}
              className={`appearance-none ${inputStyles}`}
            >
              <option value=''>Select your field</option>
              <option value='Creative and design'>Creative and design</option>
              <option value='Writing'>Writing</option>
              <option value='Tech'>Tech</option>
              <option value='Digital Marketing'>Digital Marketing</option>
              <option value='Cinematography'>Cinematography</option>
            </select>
            <FiChevronDown
              className='absolute right-3 top-12 pointer-events-none text-gray-400'
              size={20}
            />
          </div>

          {/* Industry Dropdown */}
          <div className='flex-1 min-w-[200px] relative'>
            <label htmlFor='industry' className={`${labelStyles}`}>
              Industry
            </label>
            <select
              id='industry'
              name='industry'
              value={formData.industry}
              onChange={handleChange}
              className={`appearance-none ${inputStyles}`}
            >
              <option value=''>Select your industry</option>
              {industryOptions[
                formData.field as keyof typeof industryOptions
              ]?.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <FiChevronDown
              className='absolute right-3 top-12 pointer-events-none text-gray-400'
              size={20}
            />
            {errors.industry && (
              <p className='text-red-500 text-sm mt-3'>{errors.industry}</p>
            )}
          </div>
        </div>
      )}

      {/* experience years  for sign ups */}
      {isSignup && (
        <div className='text-white'>
          <label htmlFor='name' className={`${labelStyles}`}>
            Years of experience
          </label>
          <input
            type='number'
            id='yearOfExperience'
            name='yearOfExperience'
            value={formData.yearOfExperience}
            onChange={handleChange}
            className={`appearance-none ${inputStyles}`}
            placeholder='Enter years of expericence'
            required
          />
          {errors.yearOfExperience && (
            <p className='text-red-500 text-sm mt-3'>
              {errors.yearOfExperience}
            </p>
          )}
        </div>
      )}
      {/* location for sign ups */}

      {isSignup && (
        <div className='flex flex-wrap gap-4 text-white'>
          {/* Location/State input field */}
          <div className='flex-1 min-w-[200px] relative'>
            <label htmlFor='location' className={`${labelStyles}`}>
              Location/State
            </label>
            <input
              type='text'
              id='location'
              name='location'
              value={formData.location}
              onChange={handleChange}
              className={`appearance-none ${inputStyles}`}
              placeholder='Enter your location'
              required
            />
            {errors.location && (
              <p className='text-red-500 text-sm mt-3'>{errors.location}</p>
            )}
          </div>

          {/* Local Government dropdown */}
          <div className='flex-1 min-w-[200px] relative'>
            <label htmlFor='localGov' className={`${labelStyles}`}>
              Local Government
            </label>
            <select
              id='localGov'
              name='localGov'
              value={formData.localGov}
              onChange={handleChange}
              className={`${inputStyles} appearance-none`}
            >
              <option value=''>Select Local Government</option>
              <option value='lagosIsland'>Lagos Island</option>
              <option value='ikeja'>Ikeja</option>
              <option value='surulere'>Surulere</option>
              {/* Add more local government options here */}
            </select>
            {/* Custom dropdown icon */}
            <FiChevronDown
              className='absolute right-3 top-12 pointer-events-none text-gray-400'
              size={20}
            />
            {errors.localGov && (
              <p className='text-red-500 text-sm mt-3'>{errors.localGov}</p>
            )}
          </div>
        </div>
      )}
      {isRecruiterSignup && (
        <div className='text-white'>
          <label htmlFor='name' className={`${labelStyles}`}>
            Company bio/ About Us
          </label>
          <input
            type='text'
            id='bio'
            name='bio'
            value={formData.bio}
            onChange={handleChange}
            className={`appearance-none ${inputStyles}`}
            placeholder='Enter your company bio/about us info.'
            required
          />
          {errors.bio && (
            <p className='text-red-500 text-sm mt-3'>{errors.bio}</p>
          )}
        </div>
      )}
      {/* Password + Confirm Password */}
      <div className='flex flex-col lg:flex-row gap-4 w-full'>
        {/* Password */}
        <div
          className={`text-white ${isSignin ? 'w-full' : 'w-full lg:w-1/2'}`}
        >
          <label htmlFor='password' className={`${labelStyles}`}>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className={`${inputStyles} w-full`}
            placeholder='Enter your password'
            required
          />
          {errors.password && (
            <p className='text-red-500 text-sm mt-3'>{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        {(isSignup || isRecruiterSignup) && (
          <div className='text-white w-full lg:w-1/2'>
            <label htmlFor='confirmPassword' className={`${labelStyles}`}>
              Confirm password
            </label>
            <input
              type='password'
              id='confirmPassword'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${inputStyles}`}
              placeholder='Enter your email password'
              required
            />
            {errors.confirmPassword && (
              <p className='text-red-500 text-sm mt-3'>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Keep Me Logged In */}
      {(isSignin || isRecruiterSignin) && (
        <div className='flex items-center space-x-2 text-white mt-4'>
          <input
            type='checkbox'
            id='keepLoggedIn'
            name='keepLoggedIn'
            className='w-4 h-4 text-secondary focus:ring-secondary rounded'
          />
          <label htmlFor='keepLoggedIn' className={`${labelStyles}`}>
            Keep me logged in
          </label>
        </div>
      )}

      {/* sign in button */}
      {/* Sign In Button with hover effect */}
      {(isSignin || isRecruiterSignin) && (
        <AuthButton
          type='submit'
          className='bg-white w-full text-primary mt-2 py-3 rounded-lg cursor-pointer transition duration-300 hover:bg-gray-200'
        >
          <p className='max-md:text-lg text-2xl font-bold'>Sign In</p>
        </AuthButton>
      )}

      {(isSignin || isRecruiterSignin) && (
        <div className='flex items-center gap-5 w-full mt-4'>
          <hr className='border-t border-t-white grow' />
          <p className='text-white'>or</p>
          <hr className='border-t border-t-white grow' />
        </div>
      )}

      {(isSignin || isRecruiterSignin) && (
        <AuthButton
          onClick={() => {}}
          className='border-2 border-white w-full text-white mt-2 py-3 px-10 rounded-lg cursor-pointer transition duration-300 hover:bg-white hover:text-primary'
        >
          <div className='flex justify-center items-center gap-3'>
            <p className='max-md:text-sm text-2xl'>Continue with Google</p>
            <FcGoogle size={24}/>
          </div>
        </AuthButton>
      )}

      {(isSignin || isRecruiterSignin) && (
        <p className='text-center font-light'>
          Don’t have an account wit Portgig?{' '}
          <Link href={isSignin ? '/sign-up' : '/recruiter-sign-up'}>
            <span className='font-black underline'>Sign Up</span>
          </Link>
        </p>
      )}

      {/* sign up chekcbox and sign up buttobn */}
      {(isSignup || isRecruiterSignup) && (
        <div className='flex flex-col gap-5 w-full '>
          {/* Checkbox + Label */}
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center justify-between sm:justify-end w-full'>
            <div className='flex items-center justify-start gap-2 text-white  '>
              <input
                type='checkbox'
                checked={formData.acceptedTerms}
                onChange={(e) => {
                  const checked = e.target.checked
                  setFormData((prev) => ({
                    ...prev,
                    acceptedTerms: checked,
                  }))

                  // Clear the error when checked
                  if (checked) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      acceptedTerms: '',
                    }))
                  }
                }}
                id='terms'
                name='terms'
                className='w-4 h-4 mt-1 text-secondary focus:ring-white rounded shrink-0'
              />
              <label
                htmlFor='terms'
                className='text-[10px] sm:text-xs font-medium leading-normal'
              >
                By signing up, you agree to receive emails about updates, job
                offers, and more from PortGig. 
              </label>
            </div>

            {/* Button */}
            <button
              type='submit'
              className='group sm:flex-[0.2] border border-gray-500/30 text-white py-3 px-4 rounded-lg transition-all duration-300 ease-in-out 
              transform w-full sm:w-auto cursor-pointer hover:text-black hover:shadow-md hover:scale-105 hover:bg-white
              
            '
            >
              {isLoading ? (
                <LooadingSpinner className='border-white group-hover:border-primary w-6 h-6' />
              ) : (
                <span className='text-xs md:text-sm font-inter'>Sign Up</span>
              )}
            </button>
          </div>

          {errors.acceptedTerms && (
            <span className='text-[red] text-sm'>{errors.acceptedTerms}</span>
          )}
        </div>
      )}
    </form>
  )
}

export default AuthForm
